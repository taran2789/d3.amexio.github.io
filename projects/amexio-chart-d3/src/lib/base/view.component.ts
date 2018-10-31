import { Component,  OnInit } from '@angular/core';
import {GroupbarComponent} from '../groupbar/groupbar.component';
import {AmexioD3BarChartComponent} from '../bar/bar.component';
import {AmexioD3DounutChartComponent} from '../dounut/dounut.component';
import{AmexioD3PieChartComponent } from '../pie/pie.component';
import {AmexioD3LineComponent} from '../line/line.component';
import{BarstackComponent}  from '../barstack/barstack.component';
import{CombochartComponent} from '../combochart/combochart.component'
import {
  AfterContentInit, AfterViewInit, ContentChildren,
  ElementRef, EventEmitter, Input, Output, QueryList, ViewChild,
   ViewChildren} from '@angular/core';

export class ViewDrillableComponent implements OnInit {

  @ContentChildren(AmexioD3BarChartComponent, { descendants: true }) queryBarchartinput: QueryList<AmexioD3BarChartComponent>;
  barchartinput:AmexioD3BarChartComponent[] ;

  @ContentChildren(GroupbarComponent, { descendants: true }) QueryGroupbarchartinput: QueryList<GroupbarComponent>;
  groupbarchartinput:GroupbarComponent[] ;

  @ContentChildren(AmexioD3LineComponent, { descendants: true }) QueryLinechartinput: QueryList<AmexioD3LineComponent>;
  linechartinput:AmexioD3LineComponent[] ;

  @ContentChildren(AmexioD3PieChartComponent, { descendants: true }) QueryPiechartinput: QueryList<AmexioD3PieChartComponent>;
  piechartinput:AmexioD3PieChartComponent[] ;

  @ContentChildren(AmexioD3DounutChartComponent, { descendants: true }) QueryDonutchartinput: QueryList<AmexioD3DounutChartComponent>;
  donutchartinput:AmexioD3DounutChartComponent[] ;


  @ContentChildren(BarstackComponent, { descendants: true }) QueryBarStackchartinput: QueryList<BarstackComponent>;
  barstackchartinput:BarstackComponent[] ;

  @ContentChildren(CombochartComponent, { descendants: true }) QueryCombochartinput: QueryList<CombochartComponent>;
  combochartinput:CombochartComponent[] ;

   chartInputArray:any;

  constructor() { 

  }

  ngOnInit() {

  }


  ngAfterViewInit() {
   
   return this.getComponentData();
  
  }

getComponentData(): any
{

  this.chartInputArray=[];

  this.barchartinput = this.queryBarchartinput.toArray();
  this.groupbarchartinput = this.QueryGroupbarchartinput.toArray();
  this.linechartinput=this.QueryLinechartinput.toArray();
  this.donutchartinput=this.QueryDonutchartinput.toArray();
  this.piechartinput=this.QueryPiechartinput.toArray();
  this.barstackchartinput=this.QueryBarStackchartinput.toArray();
  this.combochartinput=this.QueryCombochartinput.toArray();
  this.chartInputArray=this.chartInputArray.concat( this.barchartinput,this.groupbarchartinput,this.linechartinput,this.donutchartinput,this.piechartinput,this.barstackchartinput,this.combochartinput);
 
  return this.chartInputArray;
 
}



  

}
