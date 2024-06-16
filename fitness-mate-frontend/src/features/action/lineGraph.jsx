import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineGraph = ({ xValues, yValues, xAxisLabel, yAxisLabel }) => {
  const data = {
    labels: xValues,
    datasets: [
      {
        label: 'Data',
        data: yValues,
        fill: false,
        backgroundColor: 'rgba(212, 238, 38, 0.2)', // rare with opacity
        borderColor: '#D4EE26', // rare
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: '#FAFAFA', // txt
        },
      },
      tooltip: {
        enabled: true,
        titleColor: '#FAFAFA', // txt
        bodyColor: '#FAFAFA', // txt
        backgroundColor: '#0A0A0A', // main
      },
    },
    scales: {
      x: {
        // title: {
          display: false,
          text: xAxisLabel,
          color: '#FAFAFA', // txt
        // },
        // ticks: {
          // color: '#FAFAFA', // txt
        // },
        // grid: {
          // color: '#292929', // main-faint
        // },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: '#FAFAFA', // txt
        },
        ticks: {
          color: '#FAFAFA', // txt
        },
        grid: {
          color: '#292929', // main-faint
        },
      },
    },
  };
  console.log(xValues,yValues);
  return (
    <div className=" bg-main w-5/6 lg:w-5/6  shadow-lg rounded-lg">

      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;
