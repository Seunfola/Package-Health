import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { DependencyData, DependencyLink, DependencyNode } from '@/app/services/RepoService';

interface SimNode extends DependencyNode, d3.SimulationNodeDatum {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {}

const TYPE_COLOR: Record<DependencyNode['type'], string> = {
  safe: '#22C55E',
  vulnerable: '#F59E0B',
  critical: '#EF4444',
};

@Component({
  selector: 'app-dependency-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dependency-graph.html',
  styleUrl: './dependency-graph.css',
})
export class DependencyGraph implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: DependencyData | undefined;

  @ViewChild('svgContainer', { static: true }) private svgContainer!: ElementRef<HTMLDivElement>;

  hoveredNode: DependencyNode | null = null;

  private simulation?: d3.Simulation<SimNode, SimLink>;
  private viewInitialized = false;

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.viewInitialized) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.simulation?.stop();
  }

  get isEmpty(): boolean {
    return !this.data || this.data.nodes.length <= 1;
  }

  private render(): void {
    this.simulation?.stop();
    const host = this.svgContainer.nativeElement;
    d3.select(host).selectAll('*').remove();

    if (this.isEmpty || !this.data) return;

    const width = host.clientWidth || 640;
    const height = 360;

    const nodes: SimNode[] = this.data.nodes.map((n) => ({ ...n }));
    const links: SimLink[] = this.data.links.map((l: DependencyLink) => ({
      source: l.source,
      target: l.target,
    }));

    const svg = d3
      .select(host)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', 'Direct dependency graph, nodes colored by risk');

    const linkSelection = svg
      .append('g')
      .attr('stroke', 'rgba(15,23,42,0.2)')
      .attr('stroke-width', 1)
      .selectAll('line')
      .data(links)
      .join('line');

    const nodeSelection = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => (d.id === 'root' ? 14 : 8))
      .attr('fill', (d) => (d.id === 'root' ? '#2563EB' : TYPE_COLOR[d.type]))
      .attr('stroke', 'rgba(0,0,0,0.35)')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseenter', (_event, d) => {
        this.hoveredNode = d;
      })
      .on('mouseleave', () => {
        this.hoveredNode = null;
      });

    const labelSelection = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => (d.id === 'root' ? d.id : d.id))
      .attr('font-size', 10)
      .attr('fill', 'rgba(15,23,42,0.75)')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.id === 'root' ? -20 : -12))
      .style('pointer-events', 'none');

    this.simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(70)
          .strength(0.6),
      )
      .force('charge', d3.forceManyBody().strength(-140))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(18))
      .on('tick', () => {
        linkSelection
          .attr('x1', (d) => (d.source as SimNode).x ?? 0)
          .attr('y1', (d) => (d.source as SimNode).y ?? 0)
          .attr('x2', (d) => (d.target as SimNode).x ?? 0)
          .attr('y2', (d) => (d.target as SimNode).y ?? 0);

        nodeSelection.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);
        labelSelection.attr('x', (d) => d.x ?? 0).attr('y', (d) => d.y ?? 0);
      });
  }
}
