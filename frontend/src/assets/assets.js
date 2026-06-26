import logo from './Priesthood Fellowship Church logo.png';
import bishop from './Bishop_Mwangi_Zakayo.png';
import archbiship from './Archbishop_JJ_Gitahi.png';
import apostle from './Apostle_Consolata.png';
import apostle_consolata from './Apostle_Consolata_Portrait.png';
import pastor_symon from './Pastor_Symon.png';
import pastor_patricia from './Pastor_Patricia.png';
import evangelist_mary from './Evangelist_Mary.png';

const assets = {
    logo
}

 export const slides = [
    // {
    //   title: "Walk in Devotion",
    //   sub: "Sunday Early Service starts 7:00 AM — 9:00 AM",
    //   img: "https://plus.unsplash.com/premium_photo-1726743775422-9b6377b48b57?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    // },
    // {
    //   title: "Join the Family Service",
    //   sub: "Sunday Second Service 9:00 AM — 1:30 PM",
    //   img: "https://images.unsplash.com/photo-1745357081650-e0857e7cd6ae?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    // },
    // {
    //   title: "Wednesday Fellowship",
    //   sub: "Midweek Spiritual Recharge from 5:00 PM",
    //   img: "https://images.unsplash.com/photo-1579975096649-e773152b04cb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    // },
    {
      title: "Apostle Consolata Wambui",
      sub: "",
      img: apostle
    },
  {
    title: "His Eminence Archbishop JJ Gitahi",
    sub: "",
    img: archbiship
  },
  {
    title: "His Grace Bishop Mwangi Zakayo",
    sub: "",
    img: bishop
  }
  ];


const clergyData = [
    {
      name: 'Apostle Consolata Wambui',
      role: 'Apostle',
      image: apostle_consolata,
    },
    {
        name: 'Pastor Symon Njiru',
        role: 'Pastor',
        image: pastor_symon,
    },
    {
        name: 'Evangelist Mary Wanjiru',
        role: 'Evangelist',
        image: evangelist_mary,
    },
    {
    name: 'Pastor Patricia',
    role: 'Pastor',
    image: pastor_patricia
  }
];
export {assets, clergyData};