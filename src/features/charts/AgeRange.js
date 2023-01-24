import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetByForceQuery } from '../../services/policeAPI';
import { Bar } from 'react-chartjs-2';
import color from 'color';

function ChartReason() {
  const searchBy = useSelector((state) => state.searchBy.byForce);
  const force = useSelector((state) => state.force);
  const startdate = useSelector((state) => state.startDate);
  const dateOptions = { month: 'long', year: 'numeric' };
  const formattedStartDate = startdate.toLocaleString('en-US', dateOptions);

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

      setChartData({
        labels: Object.keys(ageCount),
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
        text: force.forceFormatted + ': ' + formattedStartDate,
      },
    },
  };

  return (
    <div className="card text-bg-light">
      <div className="card-body">
        <h5 class="card-title">Age Ranges</h5>
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
