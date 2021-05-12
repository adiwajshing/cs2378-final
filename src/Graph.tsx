import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import './Graph.css'

type LineGraphProps = {
    id: string
    years: string
    data: { x: string; y: number }[]
    color: string
}
export default (props: LineGraphProps) => {
    return (
        <div className="line-graph-container">
            <ResponsiveLine
                data={[props]}
                colors={{ size: 1, scheme: 'set1' }}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'log', base: 2 }}
                //xFormat="time:%Y/%m/%d"
                yScale={{ type: 'linear' }}
                // yFormat=" >-.2f"
                axisTop={null}
                axisBottom={{
                    tickSize: 1,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Max copyright term (years)',
                    legendOffset: 36,
                    legendPosition: 'middle',
                }}
                axisLeft={{
                    format: (e) => Math.floor(e) === e && e,
                    tickSize: 1,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: `Gross Revenue (over ${props.years} years)`,
                    legendOffset: -50,
                    legendPosition: 'middle',
                }}
                curve="linear"
                lineWidth={3}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [ ],
                    },
                ]}
            />
        </div>
    )
}