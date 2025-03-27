import { Menu } from 'electron';

const menuTemplate = [
    {
        label: 'Code Maintenance',
        submenu: [
            { label: 'Manage Index ID', click: () => console.log("CLICKED MANAGE INDEX ID.") },
            { label: 'Manage Pawn Location', click: () => console.log("CLICKED MANAGE PAWN LOCATION.") },
        ],
    },
    {
        label: 'Item Search',
        submenu: [
            { label: 'Search by Item Number', click: () => console.log("CLICKED SEARCH BY ITEM NUMBER.") },
        ],
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);

export default menu;