import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetByForceQuery } from '../../services/policeAPI';
import { Bar } from 'react-chartjs-2';

function ChartReason() {
  const searchBy = useSelector((state) => state.searchBy.byForce);
  const force = useSelector((state) => state.force);
  const startDate = useSelector((state) => state.startDate);
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
      setLabels(labels);
      setChartData({
        labels: Object.keys(genderCount),
        datasets: [
          {
            label: '',
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
          ' ' +
          new Date(startDate).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric',
          }),
      },
    },
    // scales: {
    //   xAxis: [
    //     {
    //       barThickness: 60,
    //       barPercentage: 1.9,
    //       categoryPercentage: 0.5,
    //     },
    //   ],
    // },
  };

  return (
    <div className="card text-bg-light">
      <div className="card-body">
        <h5 className="card-title">Genders</h5>
        {isLoading ? (
          <p>loading...</p>
        ) : isError ? (
          <p>Error: {isError}</p>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

export default ChartReason;
