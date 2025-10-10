import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-git-graph',
  standalone: true,
  imports: [CommonModule], // This template has the correct class name for the D3 selector
  template: '<div class="graph-container"></div>',
  styleUrls: ['./git-graph.css'],
})
export class ContributionGraph implements OnChanges {
  @Input() data: { date: string; count: number }[] = [];

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.renderChart();
    }
  }

  renderChart() {
    // Correcting the selector to match the class name in the template
    const container = d3.select(this.el.nativeElement.querySelector('.graph-container'));
    container.selectAll('*').remove();

    const width = 960,
      height = 136,
      cellSize = 17;

    const dataMap = new Map(this.data.map((d) => [d.date, d.count]));
    const dates = this.data.map((d) => new Date(d.date));
    const firstDate = d3.min(dates)!;
    const lastDate = d3.max(dates)!;
    const today = d3.timeDay.offset(lastDate, 1);

    const color = d3
      .scaleQuantize<string>()
      .domain([0, d3.max(this.data, (d) => d.count) || 1])
      .range(['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']);

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10);

    const group = svg.append('g');

    const rect = group
      .selectAll('rect')
      .data(d3.timeDays(d3.timeYear(firstDate), today))
      .join('rect')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('x', (d) => d3.timeWeek.count(d3.timeYear(d), d) * (cellSize + 2))
      .attr('y', (d) => d.getDay() * (cellSize + 2) + 20)
      .attr('fill', (d) => color(dataMap.get(d3.timeFormat('%Y-%m-%d')(d)) || 0))
      .append('title')
      .text(
        (d) =>
          `${d3.timeFormat('%A, %b %d, %Y')(d)}: ${dataMap.get(d3.timeFormat('%Y-%m-%d')(d)) || 0} commits`,
      );

    const months = d3.timeMonths(d3.timeMonth.floor(firstDate), today);
    group
      .selectAll('text')
      .data(months)
      .join('text')
      .attr('x', (d) => d3.timeWeek.count(d3.timeYear(d), d) * (cellSize + 2))
      .attr('y', 10)
      .attr('fill', 'white')
      .text(d3.timeFormat('%b'));

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    svg
      .append('g')
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data([1, 3, 5])
      .join('text')
      .attr('fill', 'white')
      .attr('y', (d) => d * (cellSize + 2) + 20)
      .text((d) => daysOfWeek[d]);
  }
}
