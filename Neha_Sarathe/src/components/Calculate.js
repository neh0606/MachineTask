import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';

const Calculate = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);

  useEffect(() => {
    fetch('http://34.198.81.140/attendance.json')
      .then((response) => response.json())
      .then((data) => {
        // Filter the data for Feb 2020
        const febData = data.filter((item) => {
          const recordDate = moment(item.date, 'MMM DD, YYYY');
          return recordDate.month() === 1 && recordDate.year() === 2020; 
        
        });
        setAttendanceData(febData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (attendanceData.length === 0) return;

  // variables for total salary, male salary, and female salary
  let totalSalary = 0;
  let maleSalary = 0;
  let femaleSalary = 0;

  attendanceData.forEach((employee) => {
    const { gender, designation, time_in, time_out, per_day_salary } = employee;

    
var startTime = moment(time_in, 'HH:mm');
var endTime = moment(time_out, 'HH:mm');
 
  var duration = moment.duration(endTime.diff(startTime));

  
  var total_hours = duration.hours();
  var minutes = duration.minutes();




    let presenceStatus;
    if (total_hours >= 8) {
      presenceStatus = 'Full Day';
    } else if (total_hours >= 4) {
      presenceStatus = 'Half Day';
    } else {
      presenceStatus = 'Absent';
    }


    let basicSalary = 0;
    if (designation === 'Worker' && presenceStatus !== 'Absent') {
      basicSalary = per_day_salary * (total_hours / 8);
    }


    let overtimeHours = 0;
    let overtimeBonus = 0;
    if (designation === 'Worker') {
      if (total_hours > 8) {
        overtimeHours = total_hours - 8;
        overtimeBonus = overtimeHours * per_day_salary * 2;
      }
    }


    const employeeSalary = basicSalary + overtimeBonus;


    totalSalary = totalSalary + employeeSalary;
    if (gender === 'Male') {
      maleSalary = maleSalary + employeeSalary;
    } else {
      femaleSalary = femaleSalary + employeeSalary;
    }
  });

  if (maleSalary < femaleSalary) {
    femaleSalary += femaleSalary * 0.01;
  } else if (femaleSalary < maleSalary) {
    maleSalary += maleSalary * 0.01;
  }


  setTotalSalary(totalSalary + maleSalary + femaleSalary);
}, [attendanceData]);

  return (
    <div>
      <h1>Total Salary for Feb 2020</h1>
      <p>Total Salary: {totalSalary}</p>
    </div>
  );
};

export default  Calculate;
