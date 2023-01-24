import React, { useState } from 'react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAvailabilityQuery,
  useGetForcesQuery,
} from '../../services/policeAPI';

function controls() {
  const [startDate, setStartDate] = useState('');
  const [forceDisabled, setForceDisabled] = useState(true);
  const [force, setForce] = useState('police-force');
  const [hasSelection, setHasSelection] = React.useState(false);
  const storeHasSelection = useSelector((state) => state.hasSelection);

  useEffect(() => {
    if (storeHasSelection !== hasSelection) {
      setHasSelection(storeHasSelection);
    }
  }, [storeHasSelection]);

  const dispatch = useDispatch();
  const {
    data: forcesList,
    error: forcesList_error,
    isLoading: forcesList_isLoading,
    isSuccess: forcesList_isSuccess,
    isError: forcesList_isError,
  } = useGetForcesQuery();
  const {
    data: availablityData,
    error: availablityData_error,
    isLoading: availablityData_isLoading,
    isSuccess: availablityData_isSuccess,
    isError: availablityData_isError,
  } = useGetAvailabilityQuery();

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    const selectedDate = event.target.value;
    dispatch({ type: 'SET_START_DATE', payload: selectedDate });
    setForceDisabled(false);
    dispatch({
      type: 'HAS_SELECTION_FALSE',
      payload: false,
    });
  };

  const handleForceChange = (event) => {
    const forceID = event.target.value;
    const forceName = forcesList.find((item) => item.id === event.target.value);
    setForce(event.target.value);
    dispatch({
      type: 'HAS_SELECTION_FALSE',
      payload: false,
    });
    dispatch({
      type: 'SET_FORCE',
      payload: { forceRaw: forceID, forceFormatted: forceName.name },
    });
  };

  const handleGetData = (event) => {
    dispatch({
      type: 'HAS_SELECTION_TRUE',
      payload: true,
    });
    dispatch({
      type: 'SET_BY_FORCE',
      payload: {
        forceRaw: force,
        startDate: startDate,
      },
    });
  };

  return (
    <div>
      <div className="card text-bg-light my-3 py-3 px-3">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4 col-md-3 col-sm-12 mb-4">
              {/* Select available start dates */}
              <p className="h6">From</p>
              <select
                className="form-select"
                value={startDate}
                onChange={handleStartDateChange}
              >
                <option className="dropdown-item" value="default">
                  start date
                </option>

                {availablityData_isLoading && 'Loading...'}
                {availablityData_isError && availablityData_error.message}
                {availablityData_isSuccess &&
                  availablityData &&
                  availablityData.map((item, index) => (
                    <option
                      className="dropdown-item"
                      value={item.date}
                      key={index} //{item.date}
                    >
                      {item.date}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
              {/* Select available polices forces using dates */}
              <p className="h6">Force</p>
              <select
                className="form-select"
                value={force}
                onChange={handleForceChange}
                disabled={forceDisabled}
              >
                <option className="dropdown" value="default">
                  available police forces
                </option>
                {availablityData_isLoading && 'Loading...'}
                {availablityData_isError && availablityData_error.message}
                {availablityData_isSuccess &&
                  availablityData &&
                  availablityData.map((outerElement) =>
                    outerElement.date === startDate
                      ? outerElement['stop-and-search'].map((innerElement) =>
                          forcesList.map((item) =>
                            innerElement === item.id ? (
                              <option value={item.id} key={item.id}>
                                {item.name}
                              </option>
                            ) : null
                          )
                        )
                      : null
                  )}
              </select>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-12 mt-3">
              <p className="h6"></p>
              <button className="btn btn-primary w-100" onClick={handleGetData}>
                Get Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default controls;
