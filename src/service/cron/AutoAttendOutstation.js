const WorktimeDao = require("../../dao/WorktimeDao")
const constant = require('../../config/constant')
const EmployeeAttendanceDao = require("../../dao/EmployeeAttendanceDao")

const worktimeDao = new WorktimeDao()
const employeeAttendanceDao = new EmployeeAttendanceDao()

module.exports = async function autoAttendOutstation() {
    const worktimeDatas = await worktimeDao.getForAutoAttend()
    if (worktimeDatas.length < 1) return

    let attendances = []
    const currentDate = new Date().toISOString().split('T')[0]
    for (let worktimeData of worktimeDatas) {
        const employees = worktimeData.division.employees
        if (employees.length < 1) continue
        for (let employee of employees) {
            if(employee.employeeattendances.length > 0){
                const alreadyExist = employee.employeeattendances.filter(attendance => attendance.worktime_id === targetWorktimeId).length > 0
                if(alreadyExist) continue
            }
            for(let outstationData of employee.employeeoutstations){
                attendances.push({
                    worktime_id: worktimeData.id,
                    employee_id: employee.id,
                    uid: `${currentDate}|${worktimeData.id}|${employee.id}`,
                    description: constant.attendDescription,
                    status: "Tepat Waktu",
                    is_outstation: true,
                    outstation_id: outstationData.id
                })
            }
        }
    }

    await employeeAttendanceDao.bulkCreate(attendances).then((data) => {
        console.log(`========== Finish Auto Attend, ${data.length} recorded` )
    })
}