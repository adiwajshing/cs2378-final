import { SelectedVariables } from "./types"

const AVG_REVENUE = 10
const WORK_GEN_FACTOR = 0.01

type Work = {
	createdYear: number
	profitabilityFactor: number
	maxProfitabilityYear: number
	state: 'copyrighted' | 'public-domain'
	revenue: number
	derivativeValue: number
}
type Entity = {
	works: Work[]
	maximumCopyrightedWorks: number
	revenue: number
}
const k = 2;
function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z/k));
}
const getMaxProfitabilityYear = (maxYears: number) => {
	let value: number
	if(Math.random() < 0.5) {
		value = Math.random() * 3
	} else {
		value = Math.random()*maxYears
	}
	return Math.floor(value)
}
const makeNewWork = (year: number, derivativeValue: number, maxYears: number, derivativeFactor: number) => {
	return {
		createdYear: year,
		profitabilityFactor: (Math.random() + 0.5 + derivativeValue*(derivativeFactor/1000))/2,
		maxProfitabilityYear: getMaxProfitabilityYear(maxYears),
		state: 'copyrighted',
		revenue: 0,
		derivativeValue
	} as Work
}
// modelled by a gaussian bell curve
const revenueOfWork = (years: number, multiplier: number, maxProfitabilityYear: number) => {
	const b = maxProfitabilityYear
	const c = multiplier
	return Math.floor(multiplier * Math.exp(
		- (years - b)*(years - b)/(2*c*c)
	))
}
// use an inverse function to model wealth inequality
const maxCopyrightedWorks = (x: number, inequality: number, scale: number) => (
	Math.ceil(
		Math.exp(-(x/scale)*(inequality/100) + 1)*(scale)
	)
)
const piracyLoss = (revenueGenerated: number, copyrightTerm: number, piracyFactor: number) => {
	return sigmoid(revenueGenerated*copyrightTerm*(piracyFactor/1000))
}
const getWorkValue = (work: Work) => (
	work.revenue*(work.createdYear+work.maxProfitabilityYear)/(work.derivativeValue+1)
)

export default (copyrightTerm: number, variables: SelectedVariables) => {
	// initialize entities
	const entities: Entity[] = [...new Array(variables.contentProducingEntities)].map((_, i) => ({
		works: [],
		maximumCopyrightedWorks: maxCopyrightedWorks(i, variables.initialWealthInequality, variables.maxWorksPerEntity),
		revenue: 0
	}))
	// list of all public domain works
	const publicDomainWorks: Work[] = []
	// lifetime "value" of all the public domain works
	let publicWorkLifetimeValue = 0
	// run the simulation
	for(let i = 0; i < variables.simulationYears;i++) {
		// loop through entities
		for(const entity of entities) {
			const maxWorks = entity.maximumCopyrightedWorks + Math.floor(entity.revenue*0.01)
			if(entity.works.length < maxWorks) {
				if(Math.random() < WORK_GEN_FACTOR*Math.max(entity.revenue, 10)) {
					entity.works.push(makeNewWork(i, 0, variables.maxYearsTillMaxProfitability, variables.derivativeFactor))
				} else if(Math.random() < (1/variables.ideasFromPublicDomain)*publicDomainWorks.length) {
					const value = publicWorkLifetimeValue*Math.random()
					let min = 0
					let rWork = undefined as any as Work
					for(const work of publicDomainWorks) {
						const workValue = getWorkValue(work)
						if(value >= min && value < min+workValue) {
							rWork = work
							break
						}
						min += workValue
					}
					if(!rWork) rWork = publicDomainWorks[publicDomainWorks.length-1]
					entity.works.push(
						makeNewWork(
							i, 
							rWork.derivativeValue+1, // increase derivative value
							rWork.maxProfitabilityYear*0.5,
							variables.derivativeFactor
						)
					)
				}
			}
			
			entity.revenue += entity.works.reduce((sum, work, idx) => {
				if(work.state === 'copyrighted') {
					let rev = revenueOfWork(
						i-work.createdYear, 
						AVG_REVENUE*work.profitabilityFactor,
						work.maxProfitabilityYear
					)
					rev *= (1 - piracyLoss(work.revenue, copyrightTerm, variables.piracyMultiplier))
					work.revenue += rev
					sum += rev
					if(i-work.createdYear > copyrightTerm) {
						work.state = 'public-domain'
						publicDomainWorks.push(work)
						publicWorkLifetimeValue += getWorkValue(work)
						entity.works.splice(idx, 1)
					}
				}
				return sum
			}, 0)
		}
	}
	return entities.reduce((sum, e) => sum + e.revenue, 0)
}