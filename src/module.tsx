import React, { PureComponent } from 'react';
import {
  PanelProps,
  PanelPlugin,
  PanelEditorProps,
  PanelOptionsGroup,
  Select,
  FormLabel,
  SeriesColorPicker,
  FormField,
} from '@grafana/ui';
import { SimpleBarChart } from './simpleBarChart';
import { getRandomColor } from './general';

interface PanelOptions {
  xAxis: string;
  colorList: {};
  yAxisLabel: string;
  stacked: boolean;
  percent: boolean;
}
const PanelDefaults = {
  xAxis: 'metric',
  colorList: {},
  yAxisLabel: '',
  stacked: false,
  percent: false,
};

export class CustomGraphPanel extends PureComponent<PanelProps<PanelOptions>> {
  render() {
    return (
      <div>
        <SimpleBarChart
          {...(this.props,
          {
            xAxis: this.props.options.xAxis,
            width: this.props.width,
            height: this.props.height,
            data: this.props.data,
            colors: this.props.options.colorList,
            yAxisLabel: this.props.options.yAxisLabel,
            isStacked: this.props.options.stacked,
            isPercentage: this.props.options.percent,
          })}
        />
      </div>
    );
  }
}

export class CustomGraphOptions extends PureComponent<
  PanelEditorProps<PanelOptions>
> {
  onXAxisChange = evt => {
    this.props.onOptionsChange({
      ...this.props.options,
      xAxis: evt.value,
    });
  };

  noXAxis = () => {
    console.error('No Vaiable XAxis Options');
    return 'No Vaiable XAxis Options';
  };

  onYAxisChange = evt => {
    this.props.onOptionsChange({
      ...this.props.options,
      yAxisLabel: evt.target.value,
    });
  };

  onStackedChange = evt => {
    this.props.onOptionsChange({
      ...this.props.options,
      stacked: evt.value,
    });
  };
  
  onPercentageChange = evt => {
    this.props.onOptionsChange({
      ...this.props.options,
      percent: evt.value,
    });
  };

  stackedPercent = evt => {
    this.props.onOptionsChange({
      ...this.props.options,
      percent: evt.value,
    });
  };

  render() {
    if (this.props.options.colorList == null) {
      this.props.options.colorList = {};
    }
    let keys = [];
    let colors = [];
    let biggestKey = '';
    this.props.data.series.forEach(ser => {
      ser.fields.forEach((obj, index) => {
        if (obj.name.length > biggestKey.length) {
          biggestKey = obj.name;
        }
        keys.push({ label: obj.name, value: obj.name, key: obj.name });
        if (this.props.options.xAxis != obj.name) {
          if (this.props.options.colorList[obj.name] == undefined) {
            this.props.options.colorList[obj.name] = getRandomColor();
          }
          colors.push(
            <FormLabel width={obj.name.length * 1}>{obj.name}</FormLabel>
          );
          colors.push(
            <SeriesColorPicker
              yaxis={0.1}
              key={obj.name}
              color={this.props.options.colorList[obj.name]}
              onChange={evt => {
                this.props.options.colorList[obj.name] = evt;
                this.props.onOptionsChange({ ...this.props.options });
              }}
            />
          );
        }
      });
    });
    let booleanOptions = [
      { label: 'true', value: true, key: 'true' },
      { label: 'false', value: false, key: 'false' },
    ];
    return (
      <PanelOptionsGroup title="Main Options">
        <div className="gf-form">
          <FormLabel width={'X Axis'.length * 0.6}>X Axis</FormLabel>
          <Select
            noOptionsMessage={this.noXAxis}
            onChange={this.onXAxisChange}
            value={{
              label: this.props.options.xAxis,
              value: this.props.options.xAxis,
              key: this.props.options.xAxis,
            }}
            placeholder="X Axis"
            options={keys}
            width={
              biggestKey.length > 0
                ? biggestKey.length
                : this.props.options.xAxis.length
            }
          />
        </div>
        <br/>
        <div className="gf-form">{colors}</div>
        <br/>
        <div className="gf-form">
          <FormField
            label="Y Label"
            placeholder="Defualt Label"
            value={
              this.props.options.yAxisLabel.length === 0
                ? null
                : this.props.options.yAxisLabel
            }
            onChange={this.onYAxisChange}
            width={"Y Label".length*0.6}
          ></FormField>
        </div>
        <br/>
        <div className="gf-form">
          <FormLabel width={'Stacked'.length * 0.6}>Stacked</FormLabel>
          <Select
            noOptionsMessage={this.noXAxis}
            options={booleanOptions}
            value={{
              label: String(this.props.options.stacked),
              value: this.props.options.stacked,
              key: String(this.props.options.stacked),
            }}
            onChange={this.onStackedChange}
          />
        </div>
        <br/>
        <div className="gf-form" hidden={!this.props.options.stacked}>
          <FormLabel width={'Percentage'.length * 0.6}>Percentage</FormLabel>
          <Select
            noOptionsMessage={this.noXAxis}
            options={booleanOptions}
            value={{
              label: String(this.props.options.percent),
              value: this.props.options.percent,
              key: String(this.props.options.percent),
            }}
            onChange={this.onPercentageChange}
          />
        </div>
      </PanelOptionsGroup>
    );
  }
}

export const plugin = new PanelPlugin(CustomGraphPanel);
plugin.setDefaults(PanelDefaults);
plugin.setEditor(CustomGraphOptions);
