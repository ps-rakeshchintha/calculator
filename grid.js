window.onload = function () {
    let employeeData = []
    let filteredEmployeeData = []
    let isLoading = true
    //Pagination variables
    let startPage = 1
    let recordsCount = 0
    let totalPages = 1
    let currentPage = startPage
    let recordsPerPage = 12
    const totalPagesElement = this.document.getElementById('total-pages')
    const currentPageInput = this.document.getElementById('current-page')
    const previousPageItem = this.document.getElementById('previous-page')
    const nextPageItem = this.document.getElementById('next-page')
    const noResults = this.document.getElementById('no-results')
    currentPageInput.value = currentPage
    let headerData = []
    this.fetch("https://emp-api-rakesh.herokuapp.com/employees").then((response) => {
        return response.json();
    }).then((data) => {
        employeeData = data
        filteredEmployeeData = employeeData
        headerData = this.Object.keys(employeeData[0])
        this.document.getElementById('loader').remove()
        generateTable()
        resetPagination()
        generateGrid()
    })

    resetPagination = () => {
        startPage = 1
        currentPage = startPage
        recordsCount = filteredEmployeeData.length
        totalPages = Math.ceil(recordsCount / recordsPerPage)
        totalPagesElement.innerHTML = " / " + totalPages
        currentPageInput.value = startPage
        paginationStyles()
    }

    generateTable = () => {

        //Create a HTML Table element.
        const table = document.createElement("TABLE");
        table.id = "employee-table"
        table.classList.add('responsive-table')
        table.classList.add('highlight')
        table.classList.add('striped')

        //Get the count of columns.
        const columnCount = headerData.length;

        //Add the header row.
        let row = table.insertRow(-1);
        for (let i = 0; i < columnCount; i++) {
            const headerCell = document.createElement("TH");
            headerCell.innerHTML = `${headerData[i].toUpperCase()} <span class="sort-controls"><i class="material-icons">expand_less</i></span>`
            headerCell.setAttribute('data-sort-by', headerData[i])
            headerCell.addEventListener('click', sortHandler)
            row.appendChild(headerCell);
        }

        const dvTable = document.getElementById("grid");
        dvTable.innerHTML = "";
        dvTable.appendChild(table);
    }

    sortHandler = (event) => {
        const header = event.target.closest("th")
        const sortDirectionElement = header.querySelector(".material-icons")
        let sortDirection = 'asc'
        if(sortDirectionElement.innerHTML === "expand_less"){
            sortDirectionElement.innerHTML = "expand_more"
            sortDirection = 'desc'
        } else {
            sortDirectionElement.innerHTML = "expand_less"
            sortDirection = 'asc'
        }
        filteredEmployeeData = filteredEmployeeData.sort(compareValues(header.dataset.sortBy, sortDirection))
        const table = document.getElementById("employee-table");
        for (let index = 0; index < headerData.length; index++) {
            if(table.rows[0].cells[index].dataset.sortBy !== header.dataset.sortBy){
                const sortDirectionElement = table.rows[0].cells[index].querySelector(".material-icons")
                sortDirectionElement.innerHTML = "expand_less"
            }
        }
        resetPagination()
        generateGrid()
    }

    function compareValues(key, order = 'asc') {
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
          }
      
          const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
      
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
    }

    generateGrid = () => {
        currentPageInput.value = currentPage
        let pagedData = filteredEmployeeData.slice((currentPage - 1) * recordsPerPage, (currentPage) * recordsPerPage)
        removeGrid()
        paginationStyles()
        const table = document.getElementById("employee-table");
        let row;
        //Add the data rows.
        for (let i = 0; i < pagedData.length; i++) {
            row = table.insertRow(-1);
            const empDataRow = pagedData[i]
            for (const key in empDataRow) {
                let cell = row.insertCell(-1);
                cell.innerHTML = pagedData[i][key];
            }
        }
    }

    filterByName = (keyword) => {
        filteredEmployeeData = employeeData.filter(e => e.firstName.toUpperCase().indexOf(keyword.toUpperCase()) > -1 || e.lastName.toUpperCase().indexOf(keyword.toUpperCase()) > -1)
        resetPagination()
        if(filteredEmployeeData.length === 0){
            noResults.classList.add("show")
        } else {
            noResults.classList.remove("show")
        }
        generateGrid()
    }

    removeGrid = () => {
        const table = document.getElementById("employee-table");
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }
    previousPage = () => {
        if (currentPage > 1) {
            currentPage--
            generateGrid()
        }
    }

    nextPage = () => {
        if (currentPage < totalPages) {
            currentPage++
            generateGrid()
        }
    }

    setPage = (value) => {
        value = Number(value)
        if (value >= 1 && value <= totalPages) {
            currentPage = value
            generateGrid()
        }
    }

    paginationStyles = () => {
        if (currentPage === 1) {
            previousPageItem.classList.add('disabled')
        } else if (currentPage === totalPages) {
            nextPageItem.classList.add('disabled')
        } else {
            nextPageItem.classList.remove('disabled')
            previousPageItem.classList.remove('disabled')
        }
    }
}