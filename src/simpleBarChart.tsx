import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatTableData } from './general';
import { getTheme } from '@grafana/ui';

interface BarChartSampleProps {
  data: {},
  xAxis:string,
  width:number,
  height:number,
  colors:{},
  yAxisLabel:string,
  isStacked:boolean,
  isPercentage:boolean,
}

export class SimpleBarChart extends PureComponent<BarChartSampleProps> {
    constructor(props?:BarChartSampleProps){
        super(props);
    }
  render() {
    const table = this.props.data;
    let items = formatTableData(table,this.props.xAxis, (this.props.isPercentage && this.props.isStacked))
    let uniqueValues = []
    let values = []
    items.forEach(item => {
    Object.keys(item).forEach(key => {
        if(key !== "name" && !uniqueValues.includes(key)){
          uniqueValues.push(key)
          if(this.props.isStacked){
            if(this.props.isPercentage){
              values.push(<Bar dataKey={key} unit="%" stackId="a" fill={this.props.colors[key]}/>)
            }
            else{
              values.push(<Bar dataKey={key} stackId="a" fill={this.props.colors[key]}/>)
            }
          }
          else{
            values.push(<Bar dataKey={key} fill={this.props.colors[key]}/>)
          }
        }
    })
    })
    return (
    	<BarChart width={this.props.width} height={this.props.height} data={items}
            margin={{top: 5, right: 0, left: 0, bottom: 5}}>
       <CartesianGrid strokeDasharray="3 3"/>
       <XAxis dataKey="name"/>
       <YAxis label={{value: this.props.yAxisLabel ,margin:{top: 5, right: 5, left: 5, bottom: 5},position:"center" ,angle: -90}}/>
       <Tooltip contentStyle={{"background":getTheme("light").background.dropdown}}/>
       <Legend height={36} />
       {values}
      </BarChart>
    );
  }
}