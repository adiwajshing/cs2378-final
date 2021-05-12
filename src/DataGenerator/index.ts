import calculateRevenue from "./calculateRevenue"
import { SelectedVariables } from "./types"
import variables from '../variables.json'
//@ts-ignore
export const DEFAULT_SELECTED_VARIABLES = Object.keys(variables).reduce((dict, key) => (
	//@ts-ignore
	{ ...dict, [key]: variables[key].default }
), { }) as SelectedVariables

const RANGE = [1,200] as const
const STEP_FACTOR = 6 // increase in step depends on this factor

export default (variables: SelectedVariables) => {
	const points: { x: string, y: number }[] = []

	for(let i = RANGE[0];i < RANGE[1];) {
		points.push({ 
			x: i.toString(),
			y: calculateRevenue(i, variables)
		})
		i += Math.ceil(i/STEP_FACTOR) // increase step size as we increase X
	}

	return points
}