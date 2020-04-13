window.onload = function () {
    const calculator = this.document.querySelector('.calculator')
    const calculatorButtons = calculator.querySelector('.calculator-buttons')
    const calculatorInput = calculator.querySelector('.calculator-input span')
    const calculatorOutput = calculator.querySelector('.calculator-output span')
    const numbersArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const mathOperationsArray = ['*', '%', '/', '+', '-']
    let inputValue = calculatorInput.innerHTML
    const allowedKeys = numbersArray.concat(mathOperationsArray).concat(['.', 'backspace', 'delete', '=', 'enter'])
    let previousInput = ""

    calculatorButtons.addEventListener('click', (event) => {
        const value = event.target.value
        formatCalculatorInput(value, inputValue)
    })

    formatCalculatorInput = (value) => {
        if (inputValue === "Infinity") {
            inputValue = "0"
        }
        if (value) {
            if (inputValue === "0" && numbersArray.indexOf(value) > -1) {
                inputValue = value
            } else if (value === "-" || value === "+") {
                if (previousInput === value) {
                    return
                }
                if (previousInput === "-" || previousInput === "+") {
                    inputValue = inputValue.slice(0, -1)
                }
                inputValue += value
            } else if (value === "*" || value === "/" || value === "%") {
                if (previousInput === value) {
                    return
                }
                if (mathOperationsArray.indexOf(previousInput) > -1) {
                    inputValue = inputValue.slice(0, -1)
                }
                inputValue += value
            } else if (value === "delete") {
                inputValue = "0"
            } else if (value === "backspace") {
                inputValue = inputValue.length === 1 ? '0' : inputValue.slice(0, -1)
            } else if (value === ".") {
                if(previousInput === "."){
                    return
                }
                inputValue += (numbersArray.indexOf(previousInput) > -1 && previousInput === "0") || previousInput === '' ? value : "0" + value
            } else if (value !== "=" && value !== "enter") {
                if(value === "0" && previousInput === "%"){
                    return
                }
                inputValue += value
            }
        }
        previousInput = inputValue.charAt(inputValue.length - 1)
        calculatorInput.innerHTML = inputValue
        evaluateResult(value)
    }

    evaluateResult = (value) => {
        if (inputValue === "0") {
            calculatorOutput.innerHTML = "="
        }
        else {
            var re = /^([-+]?)(\d+([.]?\d)?)(?:([-+*%\/])((?:[-+])?(\d+([.]?\d)?)+))+$/;
            if (inputValue.toString().match(re)) {
                const result = eval(inputValue)
                if (value === "=" || value === "enter") {
                    calculatorOutput.innerHTML = inputValue + " ="
                    calculatorInput.innerHTML = result
                    inputValue = String(result)
                } else {
                    calculatorOutput.innerHTML = "= " + result
                }
            }
        }
    }

    this.document.addEventListener('keydown', event => {
        value = event.key.toLowerCase()
        if (allowedKeys.indexOf(value) > -1) {
            event.preventDefault()
            formatCalculatorInput(value)
        }
    })
};