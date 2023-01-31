import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetByForceQuery } from '../../services/policeAPI';
import { Bar } from 'react-chartjs-2';
import color from 'color';

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
        label: 'Age Range',
        data: [],
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
      },
    ],
  });

  useEffect(() => {
    if (isSuccess) {
      const ageCount = {};
      availablityData.forEach((item) => {
        if (!ageCount[item.age_range] && item.age_range != null) {
          ageCount[item.age_range] = 0;
        }
        if (item.age_range != null) ageCount[item.age_range] += 1;
      });
      const labels = Object.keys(ageCount);
      const data = Object.values(ageCount);
      const backgroundColor = labels.map((label, index) => {
        return color('rgba(255, 0, 0, 0.6)')
          .lighten((index / labels.length) * 1.0)
          .hex();
      });
      setLabels(labels);
      setChartData({
        labels: Object.keys(ageCount),
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
  };

  return (
    <div className="card text-bg-light">
      <div className="card-body">
        <h5 className="card-title">Age Ranges</h5>
        {isLoading ? (
          <div className="spinner-border text-primary text-center" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : isError ? (
          <div className="alert alert-warning" role="alert">
            Error: {isError} - try selecting date and force and try again
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

export default ChartReason;
