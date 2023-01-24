//import React, { useState } from 'react';
import { useSelector } from 'react-redux';
//import { byForce } from '../controls/SearchSlice';
import { useGetByForceQuery } from '../../services/policeAPI';

function showResults() {
  //const [dateValue, setDateValue] = useState('');
  const { params } = useSelector((state) => state.params);
  //const dispatch = useDispatch();

  const {
    data: availablityData,
    error: availablityData_error,
    isLoading: availablityData_isLoading,
    isSuccess: availablityData_isSuccess,
    isError: availablityData_isError,
  } = useGetByForceQuery(params);

  return (
    <div>
      {/* get data by police force */}
      <ul>
        {availablityData_isLoading && 'Loading...'}
        {availablityData_isError && availablityData_error.message}
        {availablityData_isSuccess &&
          availablityData &&
          availablityData.map((item) => (
            <li>
              age range: {item.age_range} | outcome: {item.outcome} | involved
              person: {item.involved_person} | self defined ethincity:{' '}
              {item.self_defined_ethnicity} | gender: {item.gender} |
              legislation: {item.legislation} | removal of more than outer
              clothing: {item.removal_of_more_than_outer_clothing} | officer
              defined ethnicity: {item.officer_defined_ethnicity} | operation:{' '}
              {item.operation} | operation name: {item.operation_name} | type:{' '}
              {item.type} | object of search: {item.object_of_search}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default showResults;
