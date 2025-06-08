import pluralize from '../../helpers/pluralize';
import { basicOperators } from '../../helpers/strapiFilters';
import { client } from '../strapi'

export default class Model {
  filters: any[];
  currentOperator: string;
  currentConcatenator: string;
  _resolved: any;
  _limit: any;
  _sort: any;
  _populate: any;
  status: any;

  constructor(){
    this.filters = []
    this.currentOperator = '';
    this.currentConcatenator = '';
    this._resolved = null;
    this._limit = null;
    this._sort = null;
    this.status = null
    this._populate = null;
  }

  static resourceName() {
    return pluralize(this.name, 2);
  }

  static where(field: string, concatenator: string, value: number | string | boolean) {
    const instance = new this();
    return instance.where(field, concatenator, value);
  }

  static rawQuery(queryParams: any) {
    const instance = new this();
    return instance.raw(queryParams);
  }

  where(field: string, concatenator: string ,value: number | string | boolean) {
    if (this.filters.length > 0 && this.currentOperator === '') {
      this.currentOperator = '$and';
    }
    this.filters.push({
        operator: this.currentOperator,
        field,
        value,
        concatenator
      });
    return this;
  }

  static all(){
    const instance = new this();
    return instance;
  }

  draft() {
    this.status = 'draft';
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  sort(field: string, order = 'asc') {
    this._sort = `${field}:${order}`;
    return this;
  }

  or() {
    this.currentOperator = '$or';
    return this;
  }

  and() {
    this.currentOperator = '$and';
    return this;
  }

  populate(relations: Array<string> | string) {
    this._populate = relations;
    return this;
  }

  buildFilters(){
    let result = {}
    let lastOperator = ''
    const temporalFilters = this.filters.sort((a, b) => a.operator != '' ? -1 : 1);

    for (const f of temporalFilters) {
      const operator = basicOperators[f.concatenator] || f.concatenator;

      if (f.operator !== '') {
        if (result[f.operator] === undefined) {
          result[f.operator] = [];
        }

        result[f.operator].push({[f.field]: { [operator]: f.value }})
        lastOperator = f.operator;
      } else {
        if (lastOperator != '') {
          result[lastOperator].push({[f.field]: { [operator]: f.value }})
        } else {
          result = {[f.field]: { [operator]: f.value }}
        }
      }
    }

    return result;
  }

  buildQueryParams() {
    const queryParams: Record<string, any> = {};
    if (this.filters.length > 0) queryParams['filters'] = this.buildFilters()
    if (this._limit !== null) queryParams.pagination = { pageSize: this._limit }
    if (this._sort) queryParams.sort = this._sort;
    if (this._populate) queryParams.populate = this._populate;
    if (this.status) queryParams.status = this.status;
    return queryParams;
  }

  async fetch() {
    const resourceName = (this.constructor as typeof Model).resourceName();
    const res = await client.collection(resourceName).find(this.buildQueryParams())
    this._resolved = res;
    return res
  }

  async findOne(documentId: string){
    const resourceName = (this.constructor as typeof Model).resourceName();
    const res = await client.collection(resourceName).findOne(documentId, this.buildQueryParams());
    this._resolved = res;
    return res;
  }

  async raw (queryParams: any) {
    const resourceName = (this.constructor as typeof Model).resourceName();
    const res = await client.collection(resourceName).find(queryParams);
    this._resolved = res;
    return res;
  }

  then (resolve: any, reject: any) {
    return this.fetch().then(resolve).catch(reject);
  }
}