import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetByForceQuery } from '../../services/policeAPI';
import { Bar } from 'react-chartjs-2';

function ChartReason() {
  const searchBy = useSelector((state) => state.searchBy.byForce);
  const force = useSelector((state) => state.force);
  const startDate = useSelector((state) => state.startDate);
  const endDate = useSelector((state) => state.startDate);
  const dateOptions = { month: 'long', year: 'numeric' };
  const formattedStartDate = startDate.toLocaleString('en-US', dateOptions);
  const formattedEndDate = endDate.toLocaleString('en-US', dateOptions);

  const [labels, setLabels] = useState([]);

  const {
    data: availablityData,
    isLoading,
    isSuccess,
    isError,
  } = useGetByForceQuery(searchBy);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Genders',
        data: [],
        backgroundColor: 'rgba(255, 150, 0, 0.6)',
      },
    ],
  });

  useEffect(() => {
    if (isSuccess) {
      const genderCount = {};
      availablityData.forEach((item) => {
        if (!genderCount[item.gender] && item.gender != null) {
          genderCount[item.gender] = 0;
        }
        if (item.gender != null) genderCount[item.gender] += 1;
      });
      const labels = Object.keys(genderCount);
      const data = Object.values(genderCount);
      const backgroundColor = labels.map((label) => {
        if (label === 'Male') return 'rgba(87, 134, 197,0.7)';
        else if (label === 'Female') return 'rgba(248, 185, 212,0.7)';
        else return 'gray';
      });

      setChartData({
        labels: Object.keys(genderCount),
        datasets: [
          {
            label: ' ',
            data,
            backgroundColor,
          },
        ],
      });
    }
  }, [isSuccess, availablityData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: true,
        text:
          force.forceFormatted +
          ': ' +
          formattedStartDate +
          ' - ' +
          formattedEndDate,
      },
    },
    scales: {
      xAxes: [
        {
          barThickness: 20,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
        },
      ],
    },
  };

  return (
    <div className="card text-bg-light">
      <div className="card-body">
        <h5 class="card-title">Genders</h5>
        {isLoading ? (
          <text>loading...</text>
        ) : isError ? (
          <text>Error: {isError}</text>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

export default ChartReason;
