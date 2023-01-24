import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetByForceQuery } from '../../services/policeAPI';
import { Bar } from 'react-chartjs-2';
import color from 'color';

function chartEthnicity() {
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
        label: 'Ethnicity',
        data: [],
        backgroundColor: 'rgba(30, 81, 123, 0.6)',
      },
    ],
  });

  useEffect(() => {
    if (isSuccess) {
      const ethnicityCount = {};
      availablityData.forEach((item) => {
        if (
          !ethnicityCount[item.officer_defined_ethnicity] &&
          item.officer_defined_ethnicity != null
        ) {
          ethnicityCount[item.officer_defined_ethnicity] = 0;
        }
        if (item.officer_defined_ethnicity != null)
          ethnicityCount[item.officer_defined_ethnicity] += 1;
      });

      const labels = Object.keys(ethnicityCount);
      const data = Object.values(ethnicityCount);
      const backgroundColor = labels.map((label, index) => {
        return color('rgba(30, 81, 123, 0.6)')
          .lighten((index / labels.length) * 1.0)
          .hex();
      });
      setChartData({
        labels: Object.keys(ethnicityCount),
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
        <h5 class="card-title">Ethnicity</h5>
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

export default chartEthnicity;
