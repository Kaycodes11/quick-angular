import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  ColGroupDef,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  // NOTE: want to use this `gridOptions` then template <ag-grid-angular [gridOptions]="">
  // NOTE: now if using `gridOptions`; no need to use ViewChild() & access to the grid API (api) and column API (columnApi) on the gridOptions object as shown: refresh grid: this.gridOptions.api.redrawRows(); resize columns: this.gridOptions.columnApi.sizeColumnsToFit();
  // const gridOptions : GridOptions = {
  //   // PROPERTIES
  //   // Objects like myRowData and myColDefs would be created in your application
  //   rowData: myRowData,
  //   columnDefs: myColDefs,
  //   pagination: true,
  //   rowSelection: 'single',
  //
  //   // EVENTS
  //   // Add event handlers
  //   onRowClicked: event => console.log('A row was clicked'),
  //   onColumnResized: event => console.log('A column was resized'),
  //   onGridReady: event => console.log('The grid is now ready'),
  //
  //   // CALLBACKS
  //   getRowHeight: (params) => 25
  // }

  // Each Column Definition results in one Column.
  public columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Vehicle Listings',
      suppressStickyLabel: true,
      // when using marryChildren true; then can't move the cell out of its group i.e. 'Vehicle listings'
      // a new field can be added next to it like below 'price' but it can't also be moved in a group i.e. using marryChildren: true
      marryChildren: true,
      children: [
        { field: 'make', colId: 'make' },
        { field: 'model', colId: 'model' },
      ],
    },
    { field: 'price', colId: 'price' },
    {
      headerName: 'Sports Results',
      // don't show the column field name i.e. out of the view when scrolling horizontally
      suppressStickyLabel: true,
      marryChildren: true,
      children: [
        { field: 'sport', colId: 'sport' },
        { field: 'gold', colId: 'gold' },
        { field: 'silver', colId: 'silver' },
        { field: 'bronze', colId: 'bronze' },
      ],
    },
    {
      headerName: 'My Address',
      // 1. If no `field` has columnGroupShow: 'closed'; all other fields except first will be collapsed
      // 2. whichever field (first or later) has columnGroupShow: 'closed'; first it'll render on whichever field it's applied then when clicked on headerName then it will all other fields (i.e. not marked with close) except the applied field
      children: [
        {
          field: 'nationality',
          width: 140,
        },
        {
          columnGroupShow: 'open',
          field: 'postal',
          width: 100,
        },
        {
          columnGroupShow: 'open',
          field: 'mobile',
          width: 100,
        },
      ],
    },
  ];

  // DefaultColDef allows these props to be common to all columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  // Data that gets displayed in the grid
  public rowData$!: Observable<unknown[]>;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  // Example load data from server when grid emit event (gridReady) that handle it as needed
  onGridReady(params: GridReadyEvent) {
    console.log('gridReady', params);
    this.rowData$ = this.http.get<unknown[]>(
      'https://www.ag-grid.com/example-assets/row-data.json'
    );
  }

  // this is just like an onClick which runs when clicked on any cell
  onCellClicked(e: CellClickedEvent): void {
    console.info('cellClicked now', e);
  }

  // Example using Grid's API
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }

  onRowClicked(event: RowClickedEvent) {
    console.log('rowClicked event', event);
  }

  // myGetRowHeight(params: RowHeightParams<unknown>) {
  //   return 25;
  // }
}
