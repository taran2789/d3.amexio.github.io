import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AmexioD3BaseChartComponent } from '../base/base.component';
import { CommanDataService } from '../services/comman.data.service';

import * as d3 from 'd3';


@Component({
  selector: 'amexio-scatterchart',
  templateUrl: './scatterchart.component.html',
  styleUrls: ['./scatterchart.component.css']
})
export class ScatterchartComponent extends AmexioD3BaseChartComponent implements OnInit {
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 300;
  @Input('color') color: any = "blue";
  @ViewChild('chartId') chartId: ElementRef;
  @Input('data-reader') datareader: string;
  @Input('level') level: number = 0;
  @Input('target') target: number;
  @Input('drillable-data') drillabledatakey: any[] = [];

  keyArray: any[] = [];
  transformeddata: any[] = [];
  data: any;
  legends: any[];

  constructor(private myservice: CommanDataService) {
    super('scatter');
  }

  ngOnInit() {
    // this.transformData(this.data);
    // this.plotScatterChart();
    if (this.level <= 1) {
      let resp: any;
      if (this.httpmethod && this.httpurl) {
        this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
          resp = response;
        }, (error) => {
        }, () => {
          setTimeout(() => {
            this.data = this.getResponseData(resp);
            this.legendCreation();
            this.transformData(this.data);
            this.plotScatterChart();
          }, 0);
        });

      } else if (this.data) {

        setTimeout(() => {
          this.data = this.getResponseData(this.data);
          this.legendCreation();
          this.transformData(this.data);
          this.plotScatterChart();

        }, 0);

      }
    }

  }

  transformData(data: any) {
    this.keyArray = data[0];
    data.forEach((element, index) => {
      if (index > 0) {
        let DummyObject = {};
        element.forEach((individualvalue, keyindex) => {
          DummyObject[this.keyArray[keyindex]] = individualvalue;
        });//inner for loop ends
        this.transformeddata.push(DummyObject);
      }//if ends
    });//outer for loop ends
    this.data = this.transformeddata;
  }

  getResponseData(httpResponse: any) {
    let responsedata = httpResponse;
    if (this.datareader != null) {
      const dr = this.datareader.split('.');
      for (const ir of dr) {
        responsedata = responsedata[ir];
      }
    } else {
      responsedata = httpResponse;
    }
    return responsedata;
  }

  plotScatterChart() {
    if (this.chartId) {
      this.svgwidth = this.chartId.nativeElement.offsetWidth;
    } else {

      this.svgwidth = this.svgwidth;
    }
    const tooltip = this.toolTip(d3);
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const width = this.svgwidth - margin.left - margin.right;
    const height = this.svgheight - margin.top - margin.bottom;

    let x, y;

    x = d3.scaleLinear()
      .rangeRound([0, width]);

    y = d3.scaleLinear()
      .rangeRound([height, 0]);

    let xAxis = d3.axisBottom(x);

    let yAxis = d3.axisLeft(y);

    let svg = d3.select("#"+this.componentId)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain([0, d3.max(this.data, function (d) { return d[Object.keys(d)[0]] })]);
    y.domain([0, d3.max(this.data, function (d) { return d[Object.keys(d)[1]] })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")

    svg.selectAll(".dot")
      .data(this.data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4.5)
      .attr("cursor", "pointer")
      .attr("cx", function (d) {
        return x(d[Object.keys(d)[0]]);
      })
      .attr("cy", function (d) { return y(d[Object.keys(d)[1]]); })
      .attr("fill", this.color)

      .on("mouseover", (d) => {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", (d) => {
        return tooltip.html(
          this.formTooltipData(d)
        )
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", (d) => {
        return tooltip.style("visibility", "hidden");
      })
      .on("click", (d) => {
        this.scatterChartClick(d);
        this.fordrillableClick(this, d, event);
        return tooltip.style("visibility", "hidden");
      });
  }

  formTooltipData(tooltipData: any) {
    let object = {};
    for (let [key, value] of Object.entries(tooltipData)) {
      object[key] = value;
    }
    return this.toolTipForBar(object);
  }

  scatterChartClick(event: any) {
    let object = {};
    for (let [key, value] of Object.entries(event)) {
      object[key] = value;
    }
    this.chartClick(object);
  }

  legendCreation() {
    this.legends = [];
    let element = this.data[0];
    let object = { 'label': element[0] + " " + "vs" + " " + element[1], 'color': this.color };
    this.legends.push(object);
  }

  resize() {

  }
}
