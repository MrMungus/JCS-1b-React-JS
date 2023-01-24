import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetByForceQuery } from '../../services/policeAPI';
import { Bar } from 'react-chartjs-2';
import color from 'color';

function ChartReason() {
  const searchBy = useSelector((state) => state.searchBy.byForce);
  const force = useSelector((state) => state.force);
  const startDate = useSelector((state) => state.startDate);
  const dateOptions = { month: 'long', year: 'numeric' };
  const formattedStartDate = startDate.toLocaleString('en-US', dateOptions);

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
        label: 'Reason for Search',
        data: [],
        backgroundColor: 'rgba(100, 150, 0, 0.6)',
      },
    ],
  });

  useEffect(() => {
    if (isSuccess) {
      const objectOfSearchCount = {};
      availablityData.forEach((item) => {
        if (
          !objectOfSearchCount[item.object_of_search] &&
          item.object_of_search != null
        ) {
          objectOfSearchCount[item.object_of_search] = 0;
        }
        if (item.object_of_search != null)
          objectOfSearchCount[item.object_of_search] += 1;
      });
      const labels = Object.keys(objectOfSearchCount);
      const data = Object.values(objectOfSearchCount);
      const backgroundColor = labels.map((label, index) => {
        return color('rgba(255, 150, 0, 0.6)')
          .rotate((index / labels.length) * 360)
          .hex();
      });

      setChartData({
        labels: Object.keys(objectOfSearchCount),
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
        <h5 class="card-title">Reason for Search</h5>
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
