import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { CommanDataService } from '../services/comman.data.service';
import * as d3 from 'd3';@Component({
  selector: 'amexio-d3-chart-waterfall',
  templateUrl: './candlestick.component.html',
  styleUrls: ['./candlestick.component.css']
})

export class CandlestickComponent extends AmexioD3BaseChartComponent implements PlotCart, OnInit {
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 300;
  @Input('data-reader') datareader: any;
  @Input() data: any[];
  @ViewChild('chartId') chartId: ElementRef;
  @Output() onLegendClick: any = new EventEmitter<any>();

  predefinedColor = [];
  keyArray: any[] = [];
  transformeddata: any[] = [];
  height: number;
  width: number;
  margin: any = {};
  x: any;
  y: any;
  svg: any;
  tooltip: any;
  legendArray: any[] = [];
  constructor(private myservice: CommanDataService) {
    super("candlestickwaterfallchart");
  }

  ngOnInit() {
    this.predefinedColor = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    let res;
    if (this.httpmethod && this.httpurl) {
      this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
        //this.data = response;
        this.data = this.getResponseData(response);
      }, (error) => {
      }, () => {
        setTimeout(() => {
          this.transformData(this.data);
          this.initializeData();
          this.plotXYAxis();
          this.plotD3Chart();
        }, 0);
      });
    } else if (this.data) {
      setTimeout(() => {
        this.transformData(this.data);
        this.initializeData();
        this.plotXYAxis();
        this.plotD3Chart();
      }, 0);
    }
  }

  initializeData() {
    this.tooltip = this.toolTip(d3);
    if (this.chartId) {
      this.svgwidth = this.chartId.nativeElement.offsetWidth;
    } else {
      this.svgwidth = this.svgwidth;
    }
    this.margin = { top: 20, right: 30, bottom: 30, left: 60 },
      this.width = this.svgwidth - this.margin.left - this.margin.right,
      this.height = this.svgheight - this.margin.top - this.margin.bottom;
  }

  plotXYAxis() {
    // set the ranges
    this.x = d3.scaleBand().range([0, this.width]);
    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);
    // scale the range of the data
    let candlestickArray = this.data.map((d) => {
      return d[Object.keys(d)[0]];
      // d.name;
    });
    this.x.domain(candlestickArray);
    let max = d3.max(this.data, (d) => { return d.end; });
    this.y.domain([0, max]);

    this.svg = d3.select("#" + this.componentId)
    // d3.select("body").append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

    // add the X Axis
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x));
    // add the Y Axis
    this.svg.append("g")
      .call(d3.axisLeft(this.y));
  }

  plotD3Chart() {
    //  this.data = [
    //   { name: "Product Revenue", value: 420000 },
    //   { name: "Services Revenue", value: 210000 },
    //   { name: "Fixed Costs", value: -170000 },
    //   { name: "letiable Costs", value: -140000 }
    // ];

    let bar = this.svg.selectAll(".bar")
      .data(this.data)
      .enter().append("g")
      .attr("class", (d) => { return "bar " + d.class })
      .attr("transform", (d) => {
        return "translate(" + this.x(
          d[Object.keys(d)[0]]
          // d.name
        ) + ",0)";
      });

    bar.append("rect")
      .attr("y", (d) => { return this.y(Math.max(d.start, d.end)); })
      .attr("height", (d) => { return Math.abs(this.y(d.start) - this.y(d.end)); })
      .attr("width", this.x.bandwidth())
      .attr("fill", (d, i) => {
        return this.predefinedColor[i];
      })
      .attr("cursor", "pointer")
      .on("mouseover", (d) => {
        this.formTooltipData(d);
        return this.tooltip.style("visibility", "visible");

      })
      .on("mousemove", (d) => {
        return this.tooltip.html(
          this.formTooltipData(d)
        )
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", (d) => {
        return this.tooltip.style("visibility", "hidden");
      })
      .on("click", (d) => {
        this.onCandlestickClick(d);
         return this.tooltip.style("visibility", "hidden");
       })
      ;
  }

  transformData(data: any) {
    this.keyArray = data[0];
    data.forEach((element, index) => {
      if (index > 0) {
        let DummyObject: any = {};
        element.forEach((individualvalue, keyindex) => {
          DummyObject[this.keyArray[keyindex]] = individualvalue;
        });//inner for loop ends
        this.transformeddata.push(DummyObject);
      }//if ends
    });//outer for loop ends 
    this.data = this.transformeddata;
    this.addDataKeys();
    this.formLegendData();
  }

  addDataKeys() {
    let cumulative: any = 0;
    for (let i = 0; i < this.data.length; i++) {
      this.data[i]["start"] = cumulative;
      cumulative += this.data[i]["value"];
      this.data[i]["end"] = cumulative;
      this.data[i]["class"] = (this.data[i].value >= 0) ? 'positive' : 'negative'
    }
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

  formTooltipData(tooltipData:any) {
    let object ={};
    object[this.keyArray[0]] = tooltipData[Object.keys(tooltipData)[0]];
    object[this.keyArray[1]] = tooltipData[Object.keys(tooltipData)[1]];
    return this.toolTipForBar(object);
  }

  onCandlestickClick(chartData: any) {
    let object ={};
    object[this.keyArray[0]] = chartData[Object.keys(chartData)[0]];
    object[this.keyArray[1]] = chartData[Object.keys(chartData)[1]];
    this.chartClick(object);
  }

  formLegendData(){
    this.data.forEach((element, index) => {
      for (let [key, value] of Object.entries(element)) {
        if(key == this.keyArray[0] ){
          let object ={};
          object["label"] = value;
          object["color"] = this.predefinedColor[index];
          this.legendArray.push(object);
        }
      }
    });    
   }

   onCandlestickLegendClick(chartData: any){
       let object = {};
      this.data.forEach(element => {
         for (let [key, value] of Object.entries(element)) {
           if(value ==  chartData.label) {
            object[ chartData.label] = element.value;
          }
        }
      });
      this.onLegendClick.emit(object);
    }

  resize(){

  }

}
