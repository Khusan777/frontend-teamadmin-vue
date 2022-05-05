import { h } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const HomeLineChart = props => {
  return h(LineChart, { ...props });
};
HomeLineChart.props = {
  chartData: {
    type: Object,
    default: () => ({}),
  },
  options: {
    type: Object,
    default: () => ({}),
  },
};
export default HomeLineChart;
