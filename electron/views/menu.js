import { Menu } from 'electron';

const menuTemplate = [
    {
        label: 'Items',
        submenu: [
            { label: 'Item Search', click: () => console.log("CLICKED ITEM SEARCH.") },
            { label: 'Ticket Expire', click: () => console.log("CLICKED TICKET EXPIRE.") },
            { label: 'Stolen Item', click: () => console.log("CLICKED STOLEN ITEM.") },
        ],
    },
    {
        label: 'Reports',
        submenu: [
            { label: 'Overdue Report', click: () => console.log("CLICKED OVERDUE REPORT.") },
            { label: 'Daily Report', click: () => console.log("CLICKED DAILY REPORT.") },
            { label: 'Buy Back Report', click: () => console.log("CLICKED BUY BACK REPORT.") },
            { label: 'Interest Report', click: () => console.log("CLICKED INTEREST REPORT.") },
            { label: 'Customized Report', click: () => console.log("CLICKED CUSTOMIZED REPORT.") },
            { label: 'XML Report', click: () => console.log("CLICKED XML REPORT.") },
        ],
    },
    {
        label: 'Admin',
        submenu: [
            { label: 'Employee', click: () => console.log("CLICKED EMPLOYEE.") },
            { label: 'Code', click: () => console.log("CLICKED CODE.") },
        ],
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);

export default menu;

