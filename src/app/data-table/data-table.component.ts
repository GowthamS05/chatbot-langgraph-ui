import { Component,signal } from '@angular/core';

@Component({
  selector: 'app-data-table',
  imports: [],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  records = signal<any[]>([
    {"date": "2023-01-01", "sales": 1200, "region": "North", "product": "Widget A"},
    {"date": "2023-01-01", "sales": 950, "region": "South", "product": "Widget A"},
    {"date": "2023-01-01", "sales": 1500, "region": "East", "product": "Widget B"},
    {"date": "2023-01-01", "sales": 1100, "region": "West", "product": "Widget B"},
    {"date": "2023-01-02", "sales": 1300, "region": "North", "product": "Widget A"},
    {"date": "2023-01-02", "sales": 1000, "region": "South", "product": "Widget A"},
    {"date": "2023-01-02", "sales": 1600, "region": "East", "product": "Widget B"},
    {"date": "2023-01-02", "sales": 1050, "region": "West", "product": "Widget B"},
    {"date": "2023-01-03", "sales": 1250, "region": "North", "product": "Widget A"},
    {"date": "2023-01-03", "sales": 980,  "region": "South", "product": "Widget A"},
    {"date": "2023-01-03", "sales": 1550, "region": "East", "product": "Widget B"},
    {"date": "2023-01-03", "sales": 1120, "region": "West", "product": "Widget B"},
    {"date": "2023-01-04", "sales": 1350, "region": "North", "product": "Widget A"},
    {"date": "2023-01-04", "sales": 1020, "region": "South", "product": "Widget A"},
    {"date": "2023-01-04", "sales": 1650, "region": "East", "product": "Widget B"},
    {"date": "2023-01-04", "sales": 1080, "region": "West", "product": "Widget B"}
  ]);
}



