import variables from '../variables.json'

export type SelectedVariables = { [k in keyof typeof variables]: typeof variables[k]['default'] }