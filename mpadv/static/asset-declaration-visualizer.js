// Build an array that defines the asset sources we want to include or exclude in the charts.
var assetSources = new Array();

// By default, include all of the asset sources.
assetSources['real-estate'] = true;
assetSources['movable'] = true;
assetSources['shares'] = true;
assetSources['bonds'] = true;
assetSources['cash'] = true;
assetSources['debts-or-outstanding'] = true;
assetSources['annual-regular-salary'] = true;
assetSources['annual-honorariums-salary'] = true;

//TODO: Associate colors so that they don't change: ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00']

// Set the asset sources we want to exclude from the charts.
// The asset source we want to exlude are listed in the 'exlude' URL parameter.
setAssetSourcesToExclude(assetSources);


function setAssetSourcesToExclude(assetSources){
    //From "/party/vv?exclude=shares,bonds,cash" get "exclude=shares,bonds,cash"
    var urlQuery = window.location.search.substring(1);
    var keyVals = urlQuery.split("&");

    for (var i=0; i < keyVals.length; i++) {
        var keyValString = keyVals[0];

        // If URL param is the 'exclude' param then get the properties to exclude
        if(keyValString.indexOf('exclude') == 0){
            // Get [(exclude),(shares,bonds,cash)]
            var keyValPair = keyValString.split('=');

            // Get [shares, bonds, cash]
            var assetSourcesToExclude = keyValPair[1].split(',');

            // Set to false the properties we want to exlude
            for(var i=0; i < assetSourcesToExclude.length; i++){
                key = assetSourcesToExclude[i];
                assetSources[key] = false;
            }

            break;
        }
    }
}


 /**
 * Init tab: Total Assets throughout the year.
 * Draw visualization for first tab (the default tab).
 * Register event for each tabs so that visualization is drawn when we select them
 **/
function initTotalAssetsThroughoutYearsTab(declarations){
    drawTotalAssetAmountsThroughoutTheYearsStackedBarChart(
        declarations,
        'total',
        'Total Assets (Individual + Joint) Throughout The Years',
        'pane-total-assets-throughout-years-individual-and-joint');

    // Draw other combo charts when their tab is selected: Assets Throughout The Years Categorized by Their Sources.
    $('.total-assets-throughout-years a[data-toggle="tab"]').on('shown.bs.tab', function(e){

        var dataAssetOrigin = $(e.target).attr('data-asset-source');

        var paneIdEnd = dataAssetOrigin;
        if(dataAssetOrigin === 'total'){
            paneIdEnd = "individual-and-joint";
        }
        var paneId = 'pane-total-assets-throughout-years-' + paneIdEnd;

        // Let's check if we already drew the charts for this tab.
        // We don't want to redraw the charts if they are already there! 
        if($('#' + paneId).children().length == 0){

            // Build title string.
            title = 'Total ' + paneIdEnd.charAt(0).toUpperCase() + paneIdEnd.slice(1) + ' Assets Throughout The Years';

            drawTotalAssetAmountsThroughoutTheYearsStackedBarChart(
                declarations,
                dataAssetOrigin,
                title,
                paneId);
        }
    });
}

/**
 * Init tab: Assets throughout the year.
 * Draw visualization for first tab (the default tab).
 * Register event for each tabs so that visualization is drawn when we select them
 **/
function initAssetsThroughoutYearsCetegorizedBySourcesTab(declarations){
    // Draw combo chart: Total Assets (Individual + Joint) Throughout The Years Categorized by Their Sources.
    drawAssetAmountsThroughoutTheYearsComboChart(
        declarations,
        'total',
        'Total Assets (Individual + Joint) Throughout The Years Categorized by Their Sources',
        'pane-assets-throughout-years-individual-and-joint');

    // Draw other combo charts when their tab is selected: Assets Throughout The Years Categorized by Their Sources.
    $('.assets-throughout-years a[data-toggle="tab"]').on('shown.bs.tab', function(e){

        var dataAssetOrigin = $(e.target).attr('data-asset-source');

        var paneIdEnd = dataAssetOrigin;
        if(dataAssetOrigin === 'total'){
            paneIdEnd = "individual-and-joint";
        }
        var paneId = 'pane-assets-throughout-years-' + paneIdEnd;

        // Let's check if we already drew the charts for this tab.
        // We don't want to redraw the charts if they are already there! 
        if($('#' + paneId).children().length == 0){

            // Build title string.
            title = 'Total ' + paneIdEnd.charAt(0).toUpperCase() + paneIdEnd.slice(1) + ' Assets Throughout The Years Categorized by Their Sources';

            drawAssetAmountsThroughoutTheYearsComboChart(
                declarations,
                dataAssetOrigin,
                title,
                paneId);
        }
    });        
}

/**
 * Init 'Relative Contribution' pie charts year tabs.
 * draw charts for tab that is selected by default (latest year).
 **/
function initYearTabs(declarations){

    $(declarations).each(function(index){
        var declaration = $(this)[0];
        var year = declaration.year;

        var tabId =  "pane-" + year;

        // Create tab element and its content div for the current year.
        $('.nav.nav-tabs.relative-contribution-piecharts').append('<li id="tab-' + tabId + '" class="relative-contribution-piecharts"><a href="#' + tabId + '" data-toggle="tab">' + year + '</a></li>');
        $('.tab-content.relative-contribution-piecharts').append('<div id="' + tabId + '" class="tab-pane"></div>');

        // Create 'Relative Contribution of Assets' pie chart container div.
        $('#' + tabId).append('<div id="' + tabId + '-total"></div>');
        $('#' + tabId).append('<div id="' + tabId + '-individual"></div>');
        $('#' + tabId).append('<div id="' + tabId + '-joint"></div>');

        // If it's the last tab that we create, then make it the active tab.
        // Also, draw the charts for that tab since its the default tab that user will see.
        // We select the last tab by default because it represents the latest year.
        if(index == declarations.length-1){
            $('#tab-' + tabId).addClass('active');
            $('#' + tabId).addClass('active');

            drawRelativeContributionPieCharts(declaration, year);
        }
    });

    // When we switch tabs, draw the charts for that tab.
    $('.relative-contribution-piecharts a[data-toggle="tab"]').on('shown.bs.tab', function(e){
        var tabYear = $(e.target).text();

        // Get the tab href e.g. #panel-2011
        var tabHref = $(e.target).attr('href');

        // Infer a chart conainter div id from the tab ref:  #panel-2011 -->  #panel-2011-total
        // We are keeping the '#' so that we can directly get the div jQuery: $('#panel-2011-total')
        var tabIdPrefixedWithHashtag = tabHref + '-total';

        // Let's check if we already drew the charts for this tab.
        // We don't want to redraw the charts if they are already there! 
        if($(tabIdPrefixedWithHashtag).children().length == 0){

            $(declarations).each(function(index){
                var declaration = $(this)[0];
                var declarationYear = declaration.year;

                if(tabYear == declarationYear){

                    // Draw the charts.
                    drawRelativeContributionPieCharts(declaration, declarationYear);

                    // Break away from the loop now that we found the declaration that
                    // corresponds with the selected year tab.
                    return false;
                }
            });
        }  
    });
}

/**
 * Draw 3 pie charts showing the relative contribution from different asset sources:
 *  - Total Assets (Individual + Joint).
 *  - Individual Assets.
 *  - Joint Assets.
 **/
function drawRelativeContributionPieCharts(declaration, year){
    var tabId = "pane-" + year;

    var titleTotal = 'Relative Contribution by Total of Owned Assets (Individual + Joint)';
    drawRelativeContributionPieChart(declaration, 'total', titleTotal, tabId + '-total');

    var titleIndividual = 'Relative Contribution by Individually Owned Assets';
    drawRelativeContributionPieChart(declaration, 'individual', titleIndividual, tabId + '-individual');

    var titleJoint = 'Relative Contribution by Jointly Owned Assets';
    drawRelativeContributionPieChart(declaration, 'joint', titleJoint, tabId + '-joint');
}

/**
 * Draw pie chart showing the relative contribution from different asset sources.
 **/
function drawRelativeContributionPieChart(declaration, assetSource, title, chartContainerDivId){

    var dataTable = getSingleDeclarationDataTable(declaration, assetSource);

    var options = {
        title: title,
        width: 900,
        height: 500
    };

    var chart = new google.visualization.PieChart(document.getElementById(chartContainerDivId));

    chart.draw(dataTable, options); 
}

/**
 * Draw combo chart showing the asset amounts throught the years. 
 **/
function drawAssetAmountsThroughoutTheYearsComboChart(declarations, assetSource, title, chartContainerDivId){
    
    var dataTable = getMultipleDeclarationsDataTable(declarations, assetSource, true);

    var options = {
        title : title,
        width: 1000,
        height: 500,
        vAxis: {title: "Amount (log scale)", logScale: true},
        hAxis: {title: "Year"},
        seriesType: "bars"
    };

    var chart = new google.visualization.ComboChart(document.getElementById(chartContainerDivId));
    chart.draw(dataTable, options);
}

/**
 * Draw combo chart showing the asset amounts throught the years. 
 **/
function drawTotalAssetAmountsThroughoutTheYearsStackedBarChart(declarations, assetSource, title, chartContainerDivId){
    
    var dataTable = getMultipleDeclarationsDataTable(declarations, assetSource, false);

    var options = {
        title : title,
        width: 1000,
        height: 500,
        vAxis: {title: "Year"},
        hAxis: {title: "Amount"},
        seriesType: "bars",
        isStacked: true,
    };

    var chart = new google.visualization.BarChart(document.getElementById(chartContainerDivId));
    chart.draw(dataTable, options);
}

/**
 * Get the data table for pie charts.
 **/
function getSingleDeclarationDataTable(declaration, assetSource){
    var dataTable = google.visualization.arrayToDataTable([]);

    dataTable.addColumn('string', 'Asset');
    dataTable.addColumn('number', 'Amount');
    
    if(assetSources['real-estate'] == true){
        dataTable.addRow(['Real Estate', declaration.realEstate[assetSource]]);
    }

    if(assetSources['movable'] == true){
        dataTable.addRow(['Movable', declaration.movable[assetSource]]);
    }

    if(assetSources['shares'] == true){
        dataTable.addRow(['Shares', declaration.shares[assetSource]]);
    }

    if(assetSources['bonds'] == true){
        dataTable.addRow(['Bonds', declaration.bonds[assetSource]]);
    }

    if(assetSources['cash'] == true){
        dataTable.addRow(['Cash', declaration.cash[assetSource]]);
    }
    
    if(assetSources['debts-or-outstanding'] == true){
        dataTable.addRow(['Debts or Outstanding', declaration.debtsOrOutstanding[assetSource]]);
    }
    
    if(assetSources['annual-regular-salary'] == true){
        dataTable.addRow(['Annual Regular Salary', declaration.annualSalary.regular[assetSource]]);
    }
    
    if(assetSources['annual-honorariums-salary'] == true){
        dataTable.addRow(['Annual Honorariums Salary', declaration.annualSalary.honorariums[assetSource]]);
    }

    // Formater for column cells to display numbers as currency
    var formatter = new google.visualization.NumberFormat({
            fractionDigits: 0,
            prefix: '€ '
    });
    formatter.format(dataTable, 1);

    return dataTable;

}

/**
 * Get the data table for combo/bar/stacked charts.
 **/
function getMultipleDeclarationsDataTable(declarations, assetSource, showDebtsOrOutstanding){
    var dataTable = google.visualization.arrayToDataTable([]);

    dataTable.addColumn('string', 'Year');

    if(assetSources['real-estate'] == true){
        dataTable.addColumn('number', 'Real Estate');
    }

    if(assetSources['movable'] == true){
        dataTable.addColumn('number', 'Movable');
    }

    if(assetSources['shares'] == true){
        dataTable.addColumn('number', 'Shares');
    }

    if(assetSources['bonds'] == true){
        dataTable.addColumn('number', 'Bonds');
    }

    if(assetSources['cash'] == true){
        dataTable.addColumn('number', 'Cash');
    }
    
    if(assetSources['debts-or-outstanding'] == true && showDebtsOrOutstanding == true){
        dataTable.addColumn('number', 'Debts or Outstanding');
    }
    
    if(assetSources['annual-regular-salary'] == true){
        dataTable.addColumn('number', 'Annual Regular Salary');
    }
    
    if(assetSources['annual-honorariums-salary'] == true){
        dataTable.addColumn('number', 'Annual Honorariums Salary');
    }


    dataTable.addRows(declarations.length);

    // Formater for column cells to display numbers as currency
    var formatter = new google.visualization.NumberFormat({
            fractionDigits: 0,
            prefix: '€ '
    });
    
    $(declarations).each(function(index){
        var declaration = $(this)[0];

        rowIndex = index;
        columnIndex = 0;

        dataTable.setCell(rowIndex, columnIndex, declaration.year.toString());
        columnIndex++;

        if(assetSources['real-estate'] == true){
            dataTable.setCell(rowIndex, columnIndex, declaration.realEstate[assetSource]);
            formatter.format(dataTable, columnIndex);
            columnIndex++;
        }

        if(assetSources['movable'] == true){
            dataTable.setCell(rowIndex, columnIndex, declaration.movable[assetSource]);
            formatter.format(dataTable, columnIndex);
            columnIndex++;
        }

        if(assetSources['shares'] == true){
            dataTable.setCell(rowIndex, columnIndex, declaration.shares[assetSource]);
            formatter.format(dataTable, columnIndex);
            columnIndex++;
        }

        if(assetSources['bonds'] == true){
            dataTable.setCell(rowIndex, columnIndex, declaration.bonds[assetSource]);
            formatter.format(dataTable, columnIndex);
            columnIndex++;
        }

        if(assetSources['cash'] == true){
            dataTable.setCell(rowIndex, columnIndex, declaration.cash[assetSource]);
            formatter.format(dataTable, columnIndex);
            columnIndex++;
        }
        
        if(assetSources['debts-or-outstanding'] == true && showDebtsOrOutstanding == true){
            dataTable.setCell(rowIndex, columnIndex, declaration.debtsOrOutstanding[assetSource]);
            formatter.format(dataTable, columnIndex);
            columnIndex++;
        }
        
        if(assetSources['annual-regular-salary'] == true){
            dataTable.setCell(rowIndex, columnIndex, declaration.annualSalary.regular[assetSource]);
            formatter.format(dataTable, columnIndex);
            columnIndex++;
        }
        
        if(assetSources['annual-honorariums-salary'] == true){
            dataTable.setCell(rowIndex, columnIndex, declaration.annualSalary.honorariums[assetSource]);
            formatter.format(dataTable, columnIndex);
        }
    });

    return dataTable;
}


/**
 * Get data table for asset declarations by Parties or by MPs.
 **/
function getAssetDeclarationDataTable(declarations, declarationYears, assetSource, whoDeclared, whoKey){

    var dataTable = google.visualization.arrayToDataTable([]);
    var yearAssociationArray = Array();
    var whoAssociationArray = Array();

    // Create table columns
    dataTable.addColumn('string', 'Year');

    $(whoDeclared).each(function(index, who){
        // Build look up array so that we know which column index to set dataTable's cell value
        // when we iterate through the asset declarations.
        whoAssociationArray[who] = index + 1;

        // Create the column.
        dataTable.addColumn('number', who);

    });

    // Create the year rows.
    dataTable.addRows(declarationYears.length);

    $(declarationYears).each(function(index, year){
        // Build look up array so that we know which row index to set dataTable's cell value
        // when we iterate through the asset declarations.
        yearAssociationArray[year] = index;

        // Set values in year column.
        dataTable.setCell(index, 0, year.toString());
    });

    // Set asset declaration values in the data table's cells.
    $(declarations).each(function(index, declaration){
        
        year = declaration.year;
        rowIndex = yearAssociationArray[year];

        whoSlug = declaration[whoKey]['name'];
        columnIndex = whoAssociationArray[whoSlug];

        dataTable.setCell(rowIndex, columnIndex, declaration['totals'][assetSource]);
    });

    
    // Format column cells
    var formatter = new google.visualization.NumberFormat({
            fractionDigits: 0,
            prefix: '€ '
    });

    for(var i = 1; i <= whoDeclared.length; i++){
        formatter.format(dataTable, i);
    }

    return dataTable;    
}

/**
 * Get line chart asset declarations of Parties.
 **/
function drawPartiesAssetDeclarationLineChart(dataTable, title, chartContainerDivId){

    var options = {
        title : title,
        width: 1100,
        height: 600,
        vAxis: {title: "Amount (log scale)", logScale: true},
        hAxis: {title: "Year"},
        legend: 'right'
    };

    var chart = new google.visualization.LineChart(document.getElementById(chartContainerDivId));
    chart.draw(dataTable, options);
}
