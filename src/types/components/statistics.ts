// ✅ Backend Request/Response Types for Statistics
export enum AggregateFunction {
  COUNT = 'count',
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max'
}

export enum Condition {
  AND = 'and',
  OR = 'or',
  EQ = 'equal',
  NEQ = 'not_equal',
  GT = 'greater_than',
  LT = 'less_than',
  GTE = 'greater_than_or_equal',
  LTE = 'less_than_or_equal'
}

export enum Operator {
  EQ = '=',
  NEQ = '!=',
  GT = '>',
  LT = '<',
  GTE = '>=',
  LTE = '<='
}

export interface Rule {
  field: string
  operator: Operator
  value: string | number | [string] | [number | string]
}

export interface Filter {
  condition: Condition
  rules: Rule[]
}

export interface Aggregate {
  key: string
  fn: AggregateFunction
}

export interface Statistics {
  groupBy: string[]
  aggregate: Aggregate
  filter?: Filter
}

// ✅ Backend Request Format (snake_case)
export interface StatisticsRequest {
  group_by: string[]
  aggregates: {
    key: string
    function: AggregateFunction
  }
  filter?: {
    condition: Condition
    rules: Rule[]
  }
}

// ✅ Local State Management Type (for building stats configs)
export interface StatisticsConfig {
  id?: string
  group_by: string[]
  aggregates: {
    key: string
    function: AggregateFunction
  }
  filter?: {
    condition: Condition
    rules: Rule[]
  }
}
