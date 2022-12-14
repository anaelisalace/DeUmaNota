import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { AnimationDurations } from '@angular/material/core';
import { createUrlTreeFromSnapshot } from '@angular/router';

// TODO: Replace this with your own data model type
export interface EmployeeTableItem {
  id: number;
  image: string;
  name: string;
  cargo: string;
  lotacao: string;
  scoreGeralEmp: string;
  
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: EmployeeTableItem[] = [
  {
    id: 1,
    image: 'assets/antonio.png',
    name: 'Antônio Arantes',
    cargo: 'Acessor Técnico',
    lotacao: 'Secretaria de mobilidade urbana',
    scoreGeralEmp: '92/100'
  },
  {
    id: 2, image: 'assets/carlos.png',
    name: 'Carlos Bittar',
    cargo: 'Fiscal',
    lotacao: 'Secretaria do meio ambiente',
    scoreGeralEmp: '91/100'
  },

  {
    id: 3, image: 'assets/afonso.png',
    name: 'Afonso Henrique',
    cargo: 'Professor',
    lotacao: 'Secretaria da educação',
    scoreGeralEmp: '89/100'
  },

  {
    id: 4, image: 'assets/marli.png',
    name: 'Marli Conceição',
    cargo: 'Zeladora',
    lotacao: 'Secretaria da educação',
    scoreGeralEmp: '89/100'
  }
]

/**
 * Data source for the EmployeeTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EmployeeTableDataSource extends DataSource<EmployeeTableItem> {
  data: EmployeeTableItem[] = EXAMPLE_DATA;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<EmployeeTableItem[]> {
    if (this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.sort.sortChange)
        .pipe(map(() => {
          return this.getSortedData([...this.data])
          // return this.getPagedData(
          //   this.getSortedData([...this.data ])
          // );
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  // private getPagedData(data: EmployeeTableItem[]): EmployeeTableItem[] {
  //   if (this.paginator) {
  //     const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  //     return data.splice(startIndex, this.paginator.pageSize);
  //   } else {
  //     return data;
  //   }
  // }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: EmployeeTableItem[]): EmployeeTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
