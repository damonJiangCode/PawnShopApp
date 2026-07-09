# Location Mapping Readme

Generated: 2026-07-07T03:38:29.897Z

Single source for location migration. This table covers every distinct location code found in old transactions (`SA100TRAN.SA100LOCATION`) plus every code in the old location table (`WC450LOCATION`).

## Current Approved Rules

| Legacy location / pattern | Map to |
| --- | --- |
| FRON | FRON (added to seed) |
| C'5 | C5 |
| FUR2 | F10 |
| C'3 | C3 |
| C'4 | C4 |
| WATM | W-M |
| WATL | W-L |
| B1 | UNKNOWN |
| BACK | UNKNOWN |
| A1-A5 | UNKNOWN |
| CAM1-CAM5 | C1-C5 |
| U-series | UNKNOWN |
| Second-class dirty locations | UNKNOWN |
| All other unresolved legacy locations | UNKNOWN |

## Summary

| Metric | Count |
| --- | --- |
| Current seed target locations | 772 |
| Distinct old WC450LOCATION codes | 1431 |
| Distinct transaction locations | 1727 |
| Combined legacy mapping rows below | 1802 |
| Rows already present in current seed | 703 |
| Rows covered by explicit mapping rules | 41 |
| Rows mapped to UNKNOWN | 1058 |
| Mapped targets missing from current seed | 0 |

All mapped targets exist in current seed.

## Complete Location Mapping Table

| legacy_location | in_transactions | in_wc450location | wc450desc | wc450space | wc450noitem | active_pawn_ticket_count | all_ticket_count | mapped_location | mapping_rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| K | yes | yes | FREEZER,JACK | 200 | 400 | 6132 | 7864 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| FURN | yes | yes | -OUTSIDE | 20 | 0 | 5845 | 8456 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| FRON | yes | yes | 26"TV,FREEZE | 50 | -524 | 5535 | 6803 | FRON | already in current seed |
| RR'M | yes | yes | OTHER | 20 | -306 | 3768 | 4396 | RR-M | format: RR apostrophe -> RR hyphen |
| W'M | yes | yes | MEN'S WATCH | 100 | -215 | 3727 | 4656 | W-M | format: W'M -> W-M |
| CP3 | yes | yes | CELLPHONES | 0 | -72 | 3384 | 3806 | CP3 | already in current seed |
| WATM | yes | no |  |  |  | 3042 | 3870 | W-M | approved: WATM -> W-M |
| AB21 | yes | yes | TOOL BOX | 20 | -270 | 2918 | 3546 | AB21 | already in current seed |
| AK | yes | yes | OTHER | 0 | -118 | 2805 | 3944 | AK | already in current seed |
| CP10 | yes | yes | CELLPHONES | 0 | -98 | 2777 | 3155 | CP10 | already in current seed |
| RR'S | yes | yes | OTHER | 20 | -301 | 2615 | 3186 | RR-S | format: RR apostrophe -> RR hyphen |
| CP2 | yes | yes | CELLPHONES | 0 | -34 | 2383 | 2694 | CP2 | already in current seed |
| AA83 | yes | yes | WALKMANS | 20 | -211 | 2325 | 3036 | AA83 | already in current seed |
| RR'B | yes | yes | OTHER | 20 | -239 | 2307 | 2885 | RR-B | format: RR apostrophe -> RR hyphen |
| AA84 | yes | yes | WALKMANS | 20 | -186 | 2303 | 3033 | AA84 | already in current seed |
| CP1 | yes | yes | CELL PHONES | 0 | -5 | 2238 | 2580 | CP1 | already in current seed |
| CP5 | yes | yes | CELLPHONES | 0 | -45 | 2175 | 2488 | CP5 | already in current seed |
| CP6 | yes | yes | CELLPHONES | 0 | -49 | 2149 | 2409 | CP6 | already in current seed |
| RR11 | yes | yes | RINGS IN BOX | 50 | -262 | 1971 | 2356 | RR11 | already in current seed |
| CP4 | yes | yes | CELLPHONES | 0 | -34 | 1936 | 2182 | CP4 | already in current seed |
| RR'C | yes | yes | OTHER | 20 | -130 | 1902 | 2226 | RR-C | format: RR apostrophe -> RR hyphen |
| WATL | yes | no |  |  |  | 1888 | 2330 | W-L | approved: WATL -> W-L |
| RR'L | yes | yes | OTHER | 20 | -179 | 1855 | 2167 | RR-L | format: RR apostrophe -> RR hyphen |
| C'5 | yes | yes | CAMERA | 20 | -202 | 1761 | 2090 | C5 | approved: C'5 -> C5 |
| AF15 | yes | yes | STEREOS | 10 | -105 | 1742 | 2028 | AF15 | already in current seed |
| CP8 | yes | yes | CELLPHONES | 0 | -42 | 1742 | 1982 | CP8 | already in current seed |
| AB14 | yes | yes | OTHER | 0 | -118 | 1731 | 2228 | AB14 | already in current seed |
| CP9 | yes | yes | CELLPHONES | 0 | -26 | 1730 | 1940 | CP9 | already in current seed |
| AF25 | yes | yes | STEREOS | 10 | -83 | 1712 | 1984 | AF25 | already in current seed |
| AA93 | yes | yes | SUNGLASS | 10 | -133 | 1643 | 2128 | AA93 | already in current seed |
| RR'H | yes | yes | OTHER | 20 | -85 | 1611 | 1860 | RR-H | format: RR apostrophe -> RR hyphen |
| AA94 | yes | yes | MISC | 20 | -112 | 1589 | 2088 | AA94 | already in current seed |
| W'L | yes | yes | LADIES WATCH | 100 | -63 | 1579 | 1977 | W-L | format: W'L -> W-L |
| AA95 | yes | yes | RADAR DETECT | 30 | -117 | 1574 | 2007 | AA95 | already in current seed |
| AF13 | yes | yes | OTHER | 20 | -75 | 1570 | 1892 | AF13 | already in current seed |
| AF33 | yes | yes | CD PLAYERS | 10 | -65 | 1562 | 1837 | AF33 | already in current seed |
| AF45 | yes | yes | OTHER | 20 | -98 | 1552 | 1778 | AF45 | already in current seed |
| RR'P | yes | yes | OTHER | 20 | -156 | 1527 | 1831 | RR-P | format: RR apostrophe -> RR hyphen |
| R'M | yes | yes | RINGS | 100 | 63 | 1525 | 1877 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF63 | yes | yes | OTHER | 20 | -71 | 1481 | 1743 | AF63 | already in current seed |
| AF53 | yes | yes | OTHER | 20 | -60 | 1470 | 1700 | AF53 | already in current seed |
| AF35 | yes | yes | STEREOS | 10 | -82 | 1465 | 1684 | AF35 | already in current seed |
| AF43 | yes | yes | OTHER | 20 | -95 | 1442 | 1703 | AF43 | already in current seed |
| FUR2 | yes | yes | -OUTSIDE | 100 | -51 | 1441 | 2078 | F10 | approved: FUR2 -> F10 |
| C'3 | yes | yes | CAMERA | 20 | -166 | 1414 | 1854 | C3 | approved: C'3 -> C3 |
| B2 | yes | yes | GAMEBOY,CART | 60 | 62 | 1396 | 2123 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB13 | yes | yes | OTHER | 0 | -80 | 1396 | 1801 | AB13 | already in current seed |
| AF24 | yes | yes | TAPE DECK-AF | 10 | -84 | 1396 | 1622 | AF24 | already in current seed |
| AA33 | yes | yes | MOVIES | 20 | -70 | 1392 | 2014 | AA33 | already in current seed |
| AF44 | yes | yes | NIN64 | 20 | -51 | 1386 | 1617 | AF44 | already in current seed |
| AA34 | yes | yes | TAPES | 20 | -36 | 1379 | 1972 | AA34 | already in current seed |
| TG1 | yes | yes | MOVIES | 20 | 73 | 1366 | 1704 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| RR'A | yes | yes | OTHER | 20 | -134 | 1359 | 1586 | RR-A | format: RR apostrophe -> RR hyphen |
| AF23 | yes | yes | CASSETTE DEC | 10 | -70 | 1337 | 1578 | AF23 | already in current seed |
| CP7 | yes | yes | CELLPHONES | 0 | -14 | 1323 | 1492 | CP7 | already in current seed |
| AA85 | yes | yes | DISKMAN | 30 | -125 | 1301 | 1731 | AA85 | already in current seed |
| AB15 | yes | yes | OTHER | 0 | -85 | 1284 | 1699 | AB15 | already in current seed |
| AF14 | yes | yes | STUFF | 10 | -76 | 1284 | 1535 | AF14 | already in current seed |
| B1 | yes | no |  |  |  | 1275 | 1985 | UNKNOWN | approved: B1 -> UNKNOWN |
| AA24 | yes | yes | CDS | 20 | -85 | 1264 | 1885 | AA24 | already in current seed |
| C'4 | yes | yes | CAMERA | 20 | -161 | 1259 | 1526 | C4 | approved: C'4 -> C4 |
| AF34 | yes | yes | CD PLAYERS | 10 | -68 | 1210 | 1441 | AF34 | already in current seed |
| BC1 | yes | yes | RING IN BOX | 200 | 52 | 1204 | 1510 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| RR'D | yes | yes | OTHER | 20 | -119 | 1199 | 1470 | RR-D | format: RR apostrophe -> RR hyphen |
| AA23 | yes | yes | CDS | 20 | -46 | 1185 | 1778 | AA23 | already in current seed |
| AA92 | yes | yes | MISC | 20 | -77 | 1170 | 1551 | AA92 | already in current seed |
| R'B | yes | yes | RINGS | 100 | 52 | 1163 | 1471 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| RR12 | yes | yes | JEWLERY | 50 | -152 | 1161 | 1388 | RR12 | already in current seed |
| RR'T | yes | yes | OTHER | 20 | -137 | 1160 | 1403 | RR-T | format: RR apostrophe -> RR hyphen |
| R'S | yes | yes | RINGS | 100 | 42 | 1138 | 1454 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF54 | yes | yes | TV GAME MACH | 20 | -62 | 1137 | 1330 | AF54 | already in current seed |
| AVEB | yes | yes | CAR | 65 | 66 | 1133 | 1195 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| C'2 | yes | yes | CAMERA | 20 | -127 | 1120 | 1383 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA43 | yes | yes | CAR AMP | 20 | -68 | 1110 | 1579 | AA43 | already in current seed |
| B3 | yes | yes | TV CON & RAD | 50 | 51 | 1108 | 1701 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA82 | yes | yes | KNIVES | 30 | -93 | 1103 | 1539 | AA82 | already in current seed |
| RR'K | yes | yes | OTHER | 20 | -125 | 1088 | 1305 | RR-K | format: RR apostrophe -> RR hyphen |
| AC81 | yes | yes | TOOL BOX | 10 | -83 | 1085 | 1495 | AC81 | already in current seed |
| AF74 | yes | yes | OTHER | 20 | -81 | 1083 | 1228 | AF74 | already in current seed |
| AF73 | yes | yes | OTHER | 20 | -64 | 1077 | 1261 | AF73 | already in current seed |
| R'P | yes | yes | RINGS | 100 | 22 | 1072 | 1277 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA35 | yes | yes | MOVIES | 20 | -51 | 1069 | 1497 | AA35 | already in current seed |
| CP12 | yes | yes | CELLPHONE | 50 | -3 | 1063 | 1220 | CP12 | already in current seed |
| AF16 | yes | yes | STEREOS | 10 | -58 | 1051 | 1203 | AF16 | already in current seed |
| AF64 | yes | yes | S. NIN. GAME | 20 | -80 | 1050 | 1233 | AF64 | already in current seed |
| AF62 | yes | yes | OTHER | 20 | -73 | 1011 | 1177 | AF62 | already in current seed |
| AA25 | yes | yes | CDS | 20 | -70 | 1006 | 1490 | AA25 | already in current seed |
| AF22 | yes | yes | CASSETTE DEC | 10 | -52 | 1004 | 1196 | AF22 | already in current seed |
| AF84 | yes | yes | OTHER | 20 | -46 | 1004 | 1135 | AF84 | already in current seed |
| RR'G | yes | yes | OTHER | 20 | -103 | 986 | 1151 | RR-G | format: RR apostrophe -> RR hyphen |
| RR'W | yes | yes | OTHER | 20 | -83 | 962 | 1210 | RR-W | format: RR apostrophe -> RR hyphen |
| AF12 | yes | yes | OTHER | 20 | -39 | 944 | 1132 | AF12 | already in current seed |
| AA44 | yes | yes | CAR SPEAKERS | 20 | -61 | 943 | 1305 | AA44 | already in current seed |
| AF42 | yes | yes | OTHER | 20 | -35 | 940 | 1113 | AF42 | already in current seed |
| SIDE | yes | yes | CAR | 25 | 36 | 934 | 967 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF52 | yes | yes | OTHER | 20 | -39 | 929 | 1110 | AF52 | already in current seed |
| AA32 | yes | yes | MOVIES | 20 | -48 | 913 | 1379 | AA32 | already in current seed |
| AF32 | yes | yes | CD PLAYERS | 10 | -66 | 911 | 1091 | AF32 | already in current seed |
| AF83 | yes | yes | OTHER | 20 | -59 | 910 | 1058 | AF83 | already in current seed |
| AA45 | yes | yes | CAR SPEAKERS | 20 | -41 | 886 | 1203 | AA45 | already in current seed |
| AF26 | yes | yes | STEREOS | 10 | -30 | 874 | 973 | AF26 | already in current seed |
| TG3 | yes | yes | GHETTO | 20 | 71 | 856 | 1033 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| RR13 | yes | yes | JEWLERY | 50 | -159 | 845 | 969 | RR13 | already in current seed |
| AA53 | yes | yes | PHONES | 20 | -41 | 844 | 1184 | AA53 | already in current seed |
| RR'R | yes | yes | OTHER | 20 | -49 | 843 | 1007 | RR-R | format: RR apostrophe -> RR hyphen |
| AA73 | yes | yes | KICKER BOX | 10 | -54 | 837 | 1323 | AA73 | already in current seed |
| AF11 | yes | yes | OTHER | 20 | -43 | 819 | 992 | AF11 | already in current seed |
| AB34 | yes | yes | VCRS | 10 | -64 | 819 | 978 | AB34 | already in current seed |
| R'C | yes | yes | RINGS | 100 | 60 | 815 | 1019 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF51 | yes | yes | OTHER | 20 | -33 | 808 | 924 | AF51 | already in current seed |
| AA22 | yes | yes | CDS | 20 | -50 | 804 | 1209 | AA22 | already in current seed |
| G1 | yes | yes | VCR | 20 | 20 | 804 | 951 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| C1 | yes | yes | DON'T USE | 0 | 3 | 803 | 1269 | C1 | already in current seed |
| AA54 | yes | yes | PHONES | 20 | -33 | 802 | 1154 | AA54 | already in current seed |
| F 8 | yes | yes | FURNITURE | 30 | -8 | 797 | 1165 | F8 | format: F 8 -> F8 |
| AF41 | yes | yes | OTHER | 20 | -33 | 796 | 933 | AF41 | already in current seed |
| DS16 | yes | yes | DECK & AMP | 30 | 94 | 792 | 995 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF75 | yes | yes | OTHER | 20 | -38 | 790 | 905 | AF75 | already in current seed |
| AG13 | yes | yes | GHETTOS | 10 | -45 | 788 | 1098 | AG13 | already in current seed |
| AA81 | yes | yes | BELTS | 30 | -49 | 788 | 1090 | AA81 | already in current seed |
| DB | yes | yes | FURNITURE | 40 | 78 | 785 | 1031 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| A1 | yes | no |  |  |  | 782 | 1022 | UNKNOWN | approved: A1-A5 -> UNKNOWN |
| AA42 | yes | yes | CAR AMP | 20 | -58 | 781 | 1079 | AA42 | already in current seed |
| AB43 | yes | yes | VCRS | 10 | -75 | 781 | 943 | AB43 | already in current seed |
| AF61 | yes | yes | OTHER | 20 | -59 | 779 | 926 | AF61 | already in current seed |
| C2 | yes | yes | DONT USE | 0 | 1 | 775 | 1261 | C2 | already in current seed |
| AA26 | yes | yes | CDS | 20 | -47 | 774 | 1051 | AA26 | already in current seed |
| R'H | yes | yes | RINGS | 100 | 22 | 767 | 923 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA52 | yes | yes | PHONES | 20 | -40 | 764 | 1046 | AA52 | already in current seed |
| R'D | yes | yes | RINGS | 100 | 25 | 763 | 925 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF21 | yes | yes | CASSETTE DEC | 10 | -43 | 762 | 898 | AF21 | already in current seed |
| CP14 | yes | yes | Cellphone | 0 | 0 | 761 | 841 | CP14 | already in current seed |
| FA11 | yes | yes | STEREO | 10 | -97 | 759 | 994 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| RR'N | yes | yes | OTHER | 20 | -81 | 758 | 881 | RR-N | format: RR apostrophe -> RR hyphen |
| F 9 | yes | yes | FURNITURE | 30 | -16 | 753 | 1052 | F9 | format: F 9 -> F9 |
| AB12 | yes | yes | OTHER | 0 | -48 | 752 | 997 | AB12 | already in current seed |
| D5 | yes | yes | VCR | 14 | 32 | 751 | 891 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'L | yes | yes | RINGS | 100 | 25 | 746 | 931 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF94 | yes | yes | OTHER | 20 | -21 | 742 | 853 | AF94 | already in current seed |
| H1 | yes | yes | VCR | 17 | 29 | 741 | 864 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB44 | yes | yes | VCRS | 10 | -62 | 736 | 862 | AB44 | already in current seed |
| AF31 | yes | yes | CD PLAYERS | 10 | -53 | 733 | 865 | AF31 | already in current seed |
| AD11 | yes | yes | 28" TV | 3 | -45 | 729 | 895 | AD11 | already in current seed |
| C'1 | yes | yes | CAMERA | 20 | -85 | 728 | 893 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA72 | yes | yes | BIG TOOL BOX | 5 | -38 | 725 | 1128 | AA72 | already in current seed |
| AC61 | yes | yes | TOOL BOX | 10 | -61 | 725 | 983 | AC61 | already in current seed |
| AD31 | yes | yes | 28" TV | 3 | -44 | 724 | 874 | AD31 | already in current seed |
| C3 | yes | yes | DONT USE | 0 | 1 | 722 | 1123 | C3 | already in current seed |
| AB53 | yes | yes | VCRS | 10 | -46 | 722 | 862 | AB53 | already in current seed |
| AF93 | yes | yes | OTHER | 20 | -41 | 720 | 850 | AF93 | already in current seed |
| J1 | yes | yes | VCR | 18 | 31 | 713 | 851 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TC4 | yes | yes | GHETTO | 10 | 24 | 710 | 883 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF72 | yes | yes | OTHER | 20 | -50 | 708 | 826 | AF72 | already in current seed |
| GA11 | yes | yes | STEREO | 10 | -108 | 707 | 945 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| E1 | yes | yes | VCR | 12 | 23 | 700 | 839 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA55 | yes | yes | TV GAMES | 20 | -40 | 692 | 995 | AA55 | already in current seed |
| AB63 | yes | yes | VCRS | 10 | -46 | 689 | 772 | AB63 | already in current seed |
| R'W | yes | yes | RINGS | 100 | 12 | 687 | 854 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| G4 | yes | yes | VCR | 10 | 39 | 683 | 777 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| D1 | yes | yes | VCR | 14 | 34 | 681 | 795 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| I1 | yes | yes | VCR | 18 | 35 | 680 | 800 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC11 | yes | yes | GOLF CLUB | 10 | -83 | 675 | 920 | BC11 | already in current seed |
| AD61 | yes | yes | 28" TV | 3 | -58 | 674 | 808 | AD61 | already in current seed |
| AD21 | yes | yes | 26" TV | 3 | -43 | 673 | 822 | AD21 | already in current seed |
| AA14 | yes | yes | CD | 20 | -20 | 672 | 963 | AA14 | already in current seed |
| AA11 | yes | yes | CD | 20 | 137 | 668 | 1052 | AA11 | already in current seed |
| F 7 | yes | yes | FURNITURE | 30 | -105 | 662 | 913 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA91 | yes | yes | MISC | 20 | -67 | 662 | 879 | AA91 | already in current seed |
| AB45 | yes | yes | VCRS | 10 | -55 | 661 | 773 | AB45 | already in current seed |
| AF36 | yes | yes | STEREOS | 10 | -36 | 659 | 740 | AF36 | already in current seed |
| AF55 | yes | yes | OTHER | 20 | -38 | 658 | 811 | AF55 | already in current seed |
| AB23 | yes | yes | VCRS | 10 | -34 | 657 | 769 | AB23 | already in current seed |
| AC71 | yes | yes | TOOL BOX | 10 | -43 | 656 | 973 | AC71 | already in current seed |
| AA36 | yes | yes | MOVIES | 20 | -41 | 655 | 895 | AA36 | already in current seed |
| AB35 | yes | yes | VCRS | 10 | -53 | 653 | 796 | AB35 | already in current seed |
| AD22 | yes | yes | 20" TV | 3 | -8 | 653 | 790 | AD22 | already in current seed |
| AB33 | yes | yes | VCRS | 10 | -45 | 650 | 812 | AB33 | already in current seed |
| AA12 | yes | yes | CD | 20 | -51 | 647 | 972 | AA12 | already in current seed |
| CP11 | yes | yes | CELLPHONE | 50 | 8 | 646 | 735 | CP11 | already in current seed |
| AC41 | yes | yes | TOOL BOX | 10 | -45 | 644 | 907 | AC41 | already in current seed |
| D3 | yes | yes | TV CONVERTER | 35 | 43 | 643 | 968 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| E2 | yes | yes | PHONE | 30 | 58 | 641 | 1006 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB61 | yes | yes | JACKET | 20 | -78 | 641 | 838 | BB61 | already in current seed |
| BK32 | yes | yes | VACCUM | 9 | -63 | 641 | 810 | BK32 | already in current seed |
| E5 | yes | yes | VCR | 16 | 43 | 641 | 774 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| F2 | yes | yes | CAR DECK | 25 | 2 | 636 | 1033 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD71 | yes | yes | 28" TV | 3 | -58 | 633 | 750 | AD71 | already in current seed |
| AB11 | yes | yes | OTHER | 0 | -25 | 629 | 845 | AB11 | already in current seed |
| AA96 | yes | yes | TV CONVERTER | 20 | -48 | 628 | 855 | AA96 | already in current seed |
| AG43 | yes | yes | OTHER | 20 | -35 | 622 | 832 | AG43 | already in current seed |
| EA11 | yes | yes | COMPUTERS | 5 | -74 | 619 | 741 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA13 | yes | yes | CD | 20 | -62 | 618 | 893 | AA13 | already in current seed |
| RR'F | yes | yes | OTHER | 20 | -54 | 614 | 764 | RR-F | format: RR apostrophe -> RR hyphen |
| AG53 | yes | yes | OTHER | 20 | -30 | 612 | 782 | AG53 | already in current seed |
| R'A | yes | yes | RINGS | 100 | 16 | 612 | 733 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF82 | yes | yes | OTHER | 20 | -27 | 612 | 704 | AF82 | already in current seed |
| AF65 | yes | yes | OTHER | 20 | -38 | 606 | 721 | AF65 | already in current seed |
| BD11 | yes | yes | BIG STUFF | 20 | -68 | 593 | 825 | BD11 | already in current seed |
| AB54 | yes | yes | VCRS | 10 | -51 | 593 | 709 | AB54 | already in current seed |
| AD12 | yes | yes | 20" TV | 3 | -26 | 585 | 732 | AD12 | already in current seed |
| BP12 | yes | yes | VACUUM CLEAN | 6 | -22 | 583 | 712 | BP12 | already in current seed |
| CP13 | yes | yes | Cellphone | 0 | -10 | 581 | 666 | CP13 | already in current seed |
| AB64 | yes | yes | VCRS | 10 | -48 | 580 | 665 | AB64 | already in current seed |
| AD52 | yes | yes | 20" TV | 3 | -42 | 578 | 672 | AD52 | already in current seed |
| AF71 | yes | yes | OTHER | 20 | -25 | 574 | 661 | AF71 | already in current seed |
| BP11 | yes | yes | VACUUM CLEAN | 6 | -67 | 573 | 712 | BP11 | already in current seed |
| AD42 | yes | yes | 20" TV | 3 | -25 | 573 | 687 | AD42 | already in current seed |
| AB32 | yes | yes | VCRS | 10 | -37 | 573 | 677 | AB32 | already in current seed |
| AD41 | yes | yes | 28" TV | 3 | -35 | 572 | 702 | AD41 | already in current seed |
| AA21 | yes | yes | CDS | 20 | -20 | 566 | 855 | AA21 | already in current seed |
| R'T | yes | yes | RINGS | 100 | 8 | 562 | 700 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| RR'E | yes | yes | OTHER | 20 | -30 | 562 | 647 | RR-E | format: RR apostrophe -> RR hyphen |
| AC21 | yes | yes | TOOL BOX | 10 | -38 | 554 | 736 | AC21 | already in current seed |
| R'R | yes | yes | RINGS | 100 | 22 | 554 | 681 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB16 | yes | yes | OTHER | 0 | -52 | 553 | 758 | AB16 | already in current seed |
| AC83 | yes | yes | TOOLS | 10 | -14 | 552 | 789 | AC83 | already in current seed |
| AB73 | yes | yes | VCRS | 10 | -16 | 549 | 645 | AB73 | already in current seed |
| AG33 | yes | yes | GHETTOS | 10 | -29 | 548 | 730 | AG33 | already in current seed |
| AG14 | yes | yes | GHETTOS | 10 | -31 | 544 | 749 | AG14 | already in current seed |
| TA4 | yes | yes | GHETTO | 10 | 9 | 543 | 686 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB24 | yes | yes | VCRS | 10 | -39 | 542 | 678 | AB24 | already in current seed |
| AA31 | yes | yes | MOVIES | 20 | -33 | 540 | 796 | AA31 | already in current seed |
| D2 | yes | yes | CLOCK RADIO | 12 | 36 | 535 | 816 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA86 | yes | yes | DISKMAN | 30 | -63 | 533 | 707 | AA86 | already in current seed |
| AB25 | yes | yes | VCRS | 10 | -42 | 532 | 628 | AB25 | already in current seed |
| AA46 | yes | yes | CAR SPEAKERS | 20 | -47 | 531 | 703 | AA46 | already in current seed |
| AC11 | yes | yes | TOOL BOX | 20 | -47 | 530 | 751 | AC11 | already in current seed |
| AB42 | yes | yes | VCRS | 10 | -26 | 527 | 649 | AB42 | already in current seed |
| HA11 | yes | yes | BIG ITEMS | 9 | -106 | 521 | 789 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC51 | yes | yes | TOOL BOX | 10 | -49 | 521 | 776 | AC51 | already in current seed |
| AD62 | yes | yes | 20" TV | 3 | -14 | 515 | 623 | AD62 | already in current seed |
| AD32 | yes | yes | 20" TV | 3 | -5 | 513 | 641 | AD32 | already in current seed |
| I4 | yes | yes | VCR | 20 | 14 | 513 | 599 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF85 | yes | yes | OTHER | 20 | -42 | 504 | 610 | AF85 | already in current seed |
| AA63 | yes | yes | CAR DECKS | 20 | -43 | 502 | 809 | AA63 | already in current seed |
| AD13 | yes | yes | 20" TV | 3 | -11 | 501 | 648 | AD13 | already in current seed |
| AB84 | yes | yes | VCRS | 10 | -14 | 500 | 588 | AB84 | already in current seed |
| E4 | yes | yes | VCR | 12 | 34 | 497 | 627 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF46 | yes | yes | OTHER | 20 | -37 | 497 | 584 | AF46 | already in current seed |
| AG23 | yes | yes | GHETTOS | 10 | -22 | 496 | 697 | AG23 | already in current seed |
| AD51 | yes | yes | 28" TV | 3 | -26 | 496 | 589 | AD51 | already in current seed |
| AA71 | yes | yes | BIG TOOL BOX | 5 | -36 | 495 | 732 | AA71 | already in current seed |
| J2 | yes | yes | VCR | 12 | 23 | 495 | 595 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC31 | yes | yes | TOOL BOX | 10 | -41 | 493 | 713 | AC31 | already in current seed |
| AB71 | yes | yes | TOOL BOX | 10 | -51 | 493 | 668 | AB71 | already in current seed |
| CAM2 | yes | no |  |  |  | 490 | 720 | C2 | approved: CAM1-CAM5 -> C1-C5 |
| AA51 | yes | yes | ANSWERING MA | 20 | -36 | 489 | 718 | AA51 | already in current seed |
| AB83 | yes | yes | VCRS | 10 | -16 | 488 | 577 | AB83 | already in current seed |
| AF95 | yes | yes | OTHER | 20 | -51 | 487 | 569 | AF95 | already in current seed |
| AB52 | yes | yes | VCRS | 10 | -38 | 485 | 567 | AB52 | already in current seed |
| AK41 | yes | yes | LARGE TV | 6 | -36 | 482 | 606 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'G | yes | yes | RINGS | 100 | 8 | 476 | 607 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF92 | yes | yes | OTHER | 20 | -32 | 473 | 566 | AF92 | already in current seed |
| AF76 | yes | yes | OTHER | 20 | -44 | 473 | 546 | AF76 | already in current seed |
| A5 | yes | no |  |  |  | 470 | 529 | UNKNOWN | approved: A1-A5 -> UNKNOWN |
| E3 | yes | yes | ANSWERING MA | 20 | 29 | 468 | 744 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB74 | yes | yes | VCRS | 10 | -27 | 466 | 555 | AB74 | already in current seed |
| J3 | yes | yes | VCR | 12 | 20 | 465 | 530 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC63 | yes | yes | TOOLS | 10 | -15 | 464 | 624 | AC63 | already in current seed |
| T17 | yes | yes | TOOL BOX | 20 | 25 | 463 | 631 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF11 | yes | yes | STUFF | 9 | -58 | 463 | 613 | BF11 | already in current seed |
| C5 | yes | yes | DONT USE | 0 | 1 | 458 | 542 | C5 | already in current seed |
| AB61 | yes | yes | TOOL BOX | 10 | -50 | 457 | 636 | AB61 | already in current seed |
| D4 | yes | yes | VCR | 15 | 12 | 457 | 615 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| B5 | yes | yes | VCR | 19 | 16 | 456 | 530 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| F 1 | yes | yes | FURNITURE | 30 | -93 | 455 | 635 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA41 | yes | yes | CAR AMP | 20 | -36 | 453 | 668 | AA41 | already in current seed |
| H2 | yes | yes | VCR | 17 | 20 | 453 | 533 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA56 | yes | yes | TV GAMES | 20 | -28 | 452 | 625 | AA56 | already in current seed |
| AD53 | yes | yes | 20" TV | 3 | -25 | 449 | 533 | AD53 | already in current seed |
| AG16 | yes | yes | STEREO | 20 | -46 | 449 | 506 | AG16 | already in current seed |
| AC84 | yes | yes | TOOLS | 10 | -28 | 446 | 657 | AC84 | already in current seed |
| G2 | yes | yes | VCR | 15 | 15 | 446 | 556 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC73 | yes | yes | TOOLS | 10 | -32 | 445 | 640 | AC73 | already in current seed |
| AD81 | yes | yes | 28" TV | 3 | -68 | 444 | 540 | AD81 | already in current seed |
| AB62 | yes | yes | VCRS | 10 | -34 | 444 | 526 | AB62 | already in current seed |
| BM11 | yes | yes | MISC | 10 | -25 | 441 | 526 | BM11 | already in current seed |
| AG15 | yes | yes | STEREOS | 10 | -32 | 440 | 605 | AG15 | already in current seed |
| BL61 | yes | yes | MISC. | 9 | -45 | 439 | 581 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK21 | yes | yes | VACCUM | 9 | -27 | 439 | 520 | BK21 | already in current seed |
| AF86 | yes | yes | OTHER | 20 | -24 | 435 | 508 | AF86 | already in current seed |
| R'K | yes | yes | RINGS | 100 | 20 | 433 | 568 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| RR'J | yes | yes | OTHER | 20 | -47 | 431 | 534 | RR-J | format: RR apostrophe -> RR hyphen |
| CP15 | yes | yes | Cellphone | 0 | -8 | 431 | 491 | CP15 | already in current seed |
| AB55 | yes | yes | VCRS | 10 | -34 | 430 | 513 | AB55 | already in current seed |
| AG63 | yes | yes | OTHER | 20 | -49 | 428 | 588 | AG63 | already in current seed |
| AC82 | yes | yes | TOOLS | 10 | -25 | 427 | 619 | AC82 | already in current seed |
| UM1 | yes | yes | V.C. | 7 | 17 | 427 | 508 | UNKNOWN | approved: U-series -> UNKNOWN |
| AC53 | yes | yes | MISC | 10 | 8 | 426 | 565 | AC53 | already in current seed |
| J4 | yes | yes | VCR | 12 | 9 | 424 | 497 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE11 | yes | yes | GUITAR | 6 | -46 | 423 | 589 | BE11 | already in current seed |
| GUN | yes | yes | GUN | 100 | 57 | 423 | 523 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| EA21 | yes | yes | COMPUTER | 7 | -44 | 416 | 479 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'F | yes | yes | RINGS | 100 | 23 | 415 | 515 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC64 | yes | yes | TOOLS | 10 | -25 | 414 | 562 | AC64 | already in current seed |
| AG45 | yes | yes | OTHER | 20 | -23 | 414 | 532 | AG45 | already in current seed |
| AG25 | yes | yes | STEREO | 20 | -30 | 413 | 525 | AG25 | already in current seed |
| AC75 | yes | yes | TOOLS | 10 | -17 | 410 | 544 | AC75 | already in current seed |
| BK31 | yes | yes | VACCUM | 9 | -32 | 410 | 506 | BK31 | already in current seed |
| DM9 | yes | yes | MICROWAVE | 5 | 42 | 409 | 486 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB75 | yes | yes | VCRS | 10 | -19 | 409 | 480 | AB75 | already in current seed |
| AD82 | yes | yes | 20" TV | 3 | -28 | 408 | 477 | AD82 | already in current seed |
| AC62 | yes | yes | TOOLS | 10 | -14 | 404 | 561 | AC62 | already in current seed |
| AA62 | yes | yes | CAR DECKS | 20 | -33 | 403 | 662 | AA62 | already in current seed |
| BK42 | yes | yes | VACCUM | 9 | -32 | 402 | 513 | BK42 | already in current seed |
| F 2 | yes | yes | FURNITURE | 30 | -115 | 401 | 611 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC24 | yes | yes | VCR | 10 | -27 | 401 | 531 | AC24 | already in current seed |
| BX61 | yes | yes | MISC | 5 | -47 | 397 | 449 | BX61 | already in current seed |
| AC43 | yes | yes | TOOLS | 10 | -24 | 396 | 545 | AC43 | already in current seed |
| AD72 | yes | yes | 20" TV | 3 | -27 | 395 | 477 | AD72 | already in current seed |
| AC74 | yes | yes | TOOLS | 10 | -26 | 394 | 574 | AC74 | already in current seed |
| BL31 | yes | yes | MISC. | 9 | -74 | 394 | 492 | BL31 | already in current seed |
| AF81 | yes | yes | OTHER | 20 | -19 | 394 | 460 | AF81 | already in current seed |
| AD91 | yes | yes | 28" TV | 3 | -56 | 393 | 473 | AD91 | already in current seed |
| AB91 | yes | yes | TOOL BOX | 10 | -43 | 388 | 519 | AB91 | already in current seed |
| UM3 | yes | yes | V.C. | 7 | 28 | 388 | 469 | UNKNOWN | approved: U-series -> UNKNOWN |
| AB76 | yes | yes | VCRS | 10 | -22 | 388 | 436 | AB76 | already in current seed |
| AB36 | yes | yes | VCRS | 10 | -26 | 387 | 454 | AB36 | already in current seed |
| AC85 | yes | yes | TOOLS | 10 | -20 | 386 | 554 | AC85 | already in current seed |
| AB85 | yes | yes | VCRS | 10 | -23 | 386 | 470 | AB85 | already in current seed |
| BX41 | yes | yes | MISC | 5 | -28 | 385 | 465 | BX41 | already in current seed |
| AG36 | yes | yes | STEREO | 20 | -30 | 384 | 429 | AG36 | already in current seed |
| AC65 | yes | yes | TOOLS | 10 | -29 | 383 | 510 | AC65 | already in current seed |
| AB26 | yes | yes | VCRS | 10 | -12 | 382 | 457 | AB26 | already in current seed |
| AB94 | yes | yes | VCRS | 10 | -12 | 379 | 479 | AB94 | already in current seed |
| BP41 | yes | yes | VACUUM CLEAN | 6 | -38 | 377 | 448 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BX31 | yes | yes | MISC | 5 | -33 | 376 | 452 | BX31 | already in current seed |
| AC45 | yes | yes | TOOLS | 10 | -28 | 374 | 496 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DS10 | yes | yes | SM STEREO ST | 10 | 24 | 374 | 481 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC34 | yes | yes | OTHER | 20 | -17 | 373 | 507 | AC34 | already in current seed |
| AE11 | yes | yes | 28" TV | 3 | -28 | 372 | 477 | AE11 | already in current seed |
| BP61 | yes | yes | VACUUM CLEAN | 6 | -25 | 372 | 461 | BP61 | already in current seed |
| AC42 | yes | yes | TOOLS | 10 | -17 | 371 | 508 | AC42 | already in current seed |
| AB65 | yes | yes | VCRS | 10 | -38 | 370 | 434 | AB65 | already in current seed |
| A3 | yes | no |  |  |  | 369 | 600 | UNKNOWN | approved: A1-A5 -> UNKNOWN |
| AG55 | yes | yes | OTHER | 20 | -35 | 369 | 472 | AG55 | already in current seed |
| AG44 | yes | yes | OTHER | 20 | -31 | 368 | 481 | AG44 | already in current seed |
| AB51 | yes | yes | TOOL BOX | 10 | -34 | 367 | 504 | AB51 | already in current seed |
| G3 | yes | yes | VCR | 14 | 17 | 367 | 445 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK61 | yes | yes | GUITAR | 9 | -23 | 367 | 434 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB31 | yes | yes | TOOL BOX | 10 | -22 | 366 | 524 | AB31 | already in current seed |
| AG12 | yes | yes | GHETTOS | 10 | -33 | 364 | 517 | AG12 | already in current seed |
| AG34 | yes | yes | GHETTOS | 10 | -21 | 364 | 498 | AG34 | already in current seed |
| F1 | yes | yes | VCR | 8 | 25 | 364 | 452 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB46 | yes | yes | VCRS | 10 | -30 | 364 | 434 | AB46 | already in current seed |
| F 6 | yes | yes | FURNITURE | 30 | -51 | 363 | 502 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD92 | yes | yes | 20" TV | 3 | -36 | 363 | 441 | AD92 | already in current seed |
| AG73 | yes | yes | OTHER | 20 | -25 | 361 | 472 | AG73 | already in current seed |
| AC33 | yes | yes | OTHER | 20 | -21 | 358 | 487 | AC33 | already in current seed |
| AE23 | yes | yes | 20" TV | 3 | -25 | 357 | 402 | AE23 | already in current seed |
| DW1 | yes | yes | WEIGHT SET | 6 | 62 | 355 | 477 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK51 | yes | yes | VACCUM | 9 | -16 | 355 | 435 | BK51 | already in current seed |
| AB95 | yes | yes | VCRS | 10 | -17 | 354 | 418 | AB95 | already in current seed |
| H3 | yes | yes | VCR | 16 | 16 | 354 | 416 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UM2 | yes | yes | V.C. | 7 | 21 | 353 | 422 | UNKNOWN | approved: U-series -> UNKNOWN |
| RR'V | yes | yes | OTHER | 20 | -36 | 353 | 418 | RR-V | format: RR apostrophe -> RR hyphen |
| I2 | yes | yes | VCR | 10 | 11 | 353 | 417 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| CAM3 | yes | no |  |  |  | 352 | 504 | C3 | approved: CAM1-CAM5 -> C1-C5 |
| CAM1 | yes | no |  |  |  | 351 | 538 | C1 | approved: CAM1-CAM5 -> C1-C5 |
| AC44 | yes | yes | TOOLS | 10 | -12 | 348 | 491 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DS14 | yes | yes | BIG STEREO | 10 | 33 | 348 | 434 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC25 | yes | yes | OTHER | 20 | -17 | 347 | 461 | AC25 | already in current seed |
| AC54 | yes | yes | MISC | 10 | -23 | 346 | 474 | AC54 | already in current seed |
| AC55 | yes | yes | MISC | 10 | -21 | 346 | 463 | AC55 | already in current seed |
| AG32 | yes | yes | GHETTOS | 10 | -17 | 345 | 498 | AG32 | already in current seed |
| AG24 | yes | yes | GHETTOS | 10 | -22 | 345 | 469 | AG24 | already in current seed |
| RR'O | yes | yes | OTHER | 20 | -60 | 343 | 404 | RR-O | format: RR apostrophe -> RR hyphen |
| AC87 | yes | yes | TOOLS | 10 | -19 | 342 | 438 | AC87 | already in current seed |
| AK51 | yes | yes | TV | 9 | -18 | 342 | 433 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TC3 | yes | yes | GHETTO | 20 | 14 | 342 | 421 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD14 | yes | yes | 14" TV | 4 | -21 | 339 | 433 | AD14 | already in current seed |
| TG2 | yes | yes | GHETTO | 20 | 17 | 338 | 410 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AK31 | yes | yes | LARGE TV | 6 | -38 | 337 | 424 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD51 | yes | yes | BIG STUFF | 20 | -26 | 335 | 422 | BD51 | already in current seed |
| AG26 | yes | yes | STEREO | 20 | -22 | 335 | 383 | AG26 | already in current seed |
| AC72 | yes | yes | TOOLS | 10 | -20 | 333 | 484 | AC72 | already in current seed |
| BE51 | yes | yes | STUFF | 9 | -42 | 327 | 450 | BE51 | already in current seed |
| BG71 | yes | yes | MISC. | 5 | -49 | 327 | 417 | BG71 | already in current seed |
| AB81 | yes | yes | TOOL BOX | 10 | -42 | 326 | 459 | AB81 | already in current seed |
| AA27 | yes | yes | CDS | 20 | -26 | 325 | 439 | AA27 | already in current seed |
| AB22 | yes | yes | VCRS | 10 | -16 | 325 | 428 | AB22 | already in current seed |
| BK41 | yes | yes | VACCUM | 9 | -25 | 325 | 396 | BK41 | already in current seed |
| AA37 | yes | yes | MOVIES | 20 | -21 | 324 | 426 | AA37 | already in current seed |
| DA1 | yes | yes | FURNITURE | 4 | 43 | 322 | 420 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK22 | yes | yes | VACCUM | 9 | -43 | 321 | 438 | BK22 | already in current seed |
| DS17 | yes | yes | CD PLAYER | 24 | 27 | 321 | 415 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| H4 | yes | yes | VCR | 15 | 12 | 321 | 383 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC32 | yes | yes | OTHER | 20 | -16 | 318 | 426 | AC32 | already in current seed |
| AB56 | yes | yes | VCRS | 10 | -3 | 318 | 362 | AB56 | already in current seed |
| AC15 | yes | yes | OTHER | 20 | -15 | 317 | 406 | AC15 | already in current seed |
| AB27 | yes | yes | VCRS | 10 | -15 | 317 | 376 | AB27 | already in current seed |
| A2 | yes | no |  |  |  | 315 | 468 | UNKNOWN | approved: A1-A5 -> UNKNOWN |
| BL11 | yes | yes | GUITAR | 9 | -25 | 315 | 381 | BL11 | already in current seed |
| RR14 | yes | yes | JEWLERY | 50 | -48 | 315 | 370 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| G5 | yes | yes | VCR | 15 | 13 | 314 | 374 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BX11 | yes | yes | MISC | 5 | -21 | 313 | 380 | BX11 | already in current seed |
| AE24 | yes | yes | 14" TV | 3 | -20 | 310 | 364 | AE24 | already in current seed |
| AB93 | yes | yes | VCRS | 10 | -15 | 308 | 405 | AB93 | already in current seed |
| AG35 | yes | yes | STEREO | 20 | -26 | 307 | 421 | AG35 | already in current seed |
| BK11 | yes | yes | VACCUM | 9 | -28 | 307 | 409 | BK11 | already in current seed |
| AC22 | yes | yes | SMALL TOOLS | 20 | -18 | 307 | 408 | AC22 | already in current seed |
| BB33 | yes | yes | SEWING MACHI | 20 | -43 | 305 | 376 | BB33 | already in current seed |
| BQ11 | yes | yes | BABY ITEMS | 6 | -30 | 305 | 373 | BQ11 | already in current seed |
| F5 | yes | yes | VCR | 12 | 17 | 304 | 376 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC14 | yes | yes | OTHER | 20 | -20 | 300 | 391 | AC14 | already in current seed |
| AF96 | yes | yes | OTHER | 20 | -22 | 300 | 365 | AF96 | already in current seed |
| BS11 | yes | yes | MISC. | 10 | -6 | 300 | 350 | BS11 | already in current seed |
| T18 | yes | yes | TOOL BOX | 20 | 24 | 299 | 388 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB72 | yes | yes | VCRS | 10 | -28 | 297 | 371 | AB72 | already in current seed |
| EA22 | yes | yes | COMPUTER | 7 | -27 | 297 | 357 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB41 | yes | yes | TOOL BOX | 10 | -18 | 295 | 445 | AB41 | already in current seed |
| BG11 | yes | yes | STUFF | 9 | -34 | 295 | 433 | BG11 | already in current seed |
| AC86 | yes | yes | TOOLS | 10 | -6 | 294 | 413 | AC86 | already in current seed |
| AE34 | yes | yes | 14" TV | 3 | -32 | 294 | 343 | AE34 | already in current seed |
| AC52 | yes | yes | MISC | 10 | -15 | 293 | 406 | AC52 | already in current seed |
| AK11 | yes | yes | 26" TV | 6 | -28 | 293 | 368 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BX51 | yes | yes | MISC | 5 | -20 | 292 | 362 | BX51 | already in current seed |
| DV8 | yes | yes | GUITARS | 10 | 11 | 292 | 349 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC35 | yes | yes | OTHER | 20 | -14 | 291 | 397 | AC35 | already in current seed |
| AD43 | yes | yes | 20" TV | 3 | -19 | 289 | 349 | AD43 | already in current seed |
| I3 | yes | yes | VCR | 10 | 10 | 288 | 349 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG42 | yes | yes | OTHER | 20 | -7 | 285 | 401 | AG42 | already in current seed |
| AG52 | yes | yes | OTHER | 20 | -12 | 285 | 388 | AG52 | already in current seed |
| FA12 | yes | yes | STEREO | 10 | -23 | 285 | 367 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC26 | yes | yes | OTHER | 20 | -10 | 285 | 362 | AC26 | already in current seed |
| AE12 | yes | yes | 20" TV | 3 | -21 | 283 | 347 | AE12 | already in current seed |
| TB4 | yes | yes | GHETTO | 8 | 22 | 282 | 330 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BP21 | yes | yes | VACUUM CLEAN | 6 | -25 | 277 | 349 | BP21 | already in current seed |
| AB37 | yes | yes | VCRS | 10 | -18 | 277 | 334 | AB37 | already in current seed |
| UM5 | yes | yes | V.C. | 7 | 17 | 277 | 327 | UNKNOWN | approved: U-series -> UNKNOWN |
| TC2 | yes | yes | GHETTO | 10 | 10 | 276 | 345 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BM51 | yes | yes | MISC | 10 | -17 | 274 | 341 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA33 | yes | yes | JACKET | 20 | -29 | 273 | 372 | BA33 | already in current seed |
| EA31 | yes | yes | COMPUTER | 5 | -26 | 273 | 309 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC13 | yes | yes | OTHER | 20 | -24 | 272 | 372 | AC13 | already in current seed |
| F 5 | yes | yes | FURNITURE | 30 | -19 | 272 | 366 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK52 | yes | yes | VACCUM | 9 | -37 | 272 | 345 | BK52 | already in current seed |
| AK21 | yes | yes | LARGE TV | 6 | -27 | 271 | 346 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD24 | yes | yes | 14" TV | 3 | -25 | 271 | 344 | AD24 | already in current seed |
| AC67 | yes | yes | TOOLS | 10 | -13 | 271 | 337 | AC67 | already in current seed |
| AG65 | yes | yes | OTHER | 20 | -17 | 269 | 366 | AG65 | already in current seed |
| BP31 | yes | yes | VACUUM CLEAN | 6 | -24 | 269 | 354 | BP31 | already in current seed |
| AB82 | yes | yes | VCRS | 10 | -7 | 269 | 322 | AB82 | already in current seed |
| R3 | yes | yes | TOOLS | 5 | 26 | 268 | 390 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB31 | yes | yes | JACKET | 20 | -31 | 268 | 356 | BB31 | already in current seed |
| AC77 | yes | yes | TOOLS | 10 | -13 | 268 | 346 | AC77 | already in current seed |
| UM4 | yes | yes | V.C. | 7 | 20 | 267 | 322 | UNKNOWN | approved: U-series -> UNKNOWN |
| TE2 | yes | yes | GHETTO | 15 | 15 | 265 | 326 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BL21 | yes | yes | GUITAR | 9 | -24 | 265 | 325 | BL21 | already in current seed |
| R'J | yes | yes | RINGS | 100 | 11 | 264 | 348 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB86 | yes | yes | VCRS | 10 | -12 | 264 | 320 | AB86 | already in current seed |
| F3 | yes | yes | CAR SPEAKERS | 8 | 18 | 263 | 513 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG54 | yes | yes | OTHER | 20 | -22 | 263 | 363 | AG54 | already in current seed |
| AE31 | yes | yes | 28" TV | 3 | -9 | 263 | 327 | AE31 | already in current seed |
| DS15 | yes | yes | MID STEREO S | 14 | 25 | 262 | 326 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T14 | yes | yes | TOOL BOX | 20 | 5 | 260 | 343 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC47 | yes | yes | TOOLS | 10 | -15 | 260 | 311 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE63 | yes | yes | 20" TV | 3 | -24 | 260 | 292 | AE63 | already in current seed |
| FA22 | yes | yes | STEREO | 10 | -33 | 259 | 328 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE41 | yes | yes | 28" TV | 3 | -32 | 259 | 324 | AE41 | already in current seed |
| AF91 | yes | yes | OTHER | 20 | -19 | 259 | 309 | AF91 | already in current seed |
| AC16 | yes | yes | OTHER | 20 | -14 | 256 | 335 | AC16 | already in current seed |
| AG22 | yes | yes | GHETTOS | 10 | -21 | 255 | 373 | AG22 | already in current seed |
| AB92 | yes | yes | VCRS | 10 | -16 | 255 | 333 | AB92 | already in current seed |
| BQ51 | yes | yes | BABY ITEMS | 6 | -17 | 255 | 326 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE64 | yes | yes | 14" TV | 3 | -21 | 255 | 291 | AE64 | already in current seed |
| BR11 | yes | yes | MISC. | 10 | -15 | 254 | 305 | BR11 | already in current seed |
| AE13 | yes | yes | 20" TV | 3 | -12 | 254 | 304 | AE13 | already in current seed |
| DV1 | yes | yes | KEYBOARD | 20 | -5 | 253 | 323 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG31 | yes | yes | GHETTOS | 10 | -15 | 252 | 345 | AG31 | already in current seed |
| AC76 | yes | yes | TOOLS | 10 | -8 | 250 | 339 | AC76 | already in current seed |
| AC36 | yes | yes | OTHER | 20 | -9 | 250 | 324 | AC36 | already in current seed |
| AD34 | yes | yes | 14" TV | 3 | -18 | 250 | 309 | AD34 | already in current seed |
| AC23 | yes | yes | VCR | 10 | -10 | 249 | 350 | AC23 | already in current seed |
| AC12 | yes | yes | OTHER | 20 | -21 | 249 | 318 | AC12 | already in current seed |
| AE71 | yes | yes | 28" TV | 3 | -32 | 249 | 306 | AE71 | already in current seed |
| AA74 | yes | yes | KICKER BOX | 10 | -16 | 248 | 378 | AA74 | already in current seed |
| BC51 | yes | yes | BIG STUFF | 20 | -21 | 248 | 335 | BC51 | already in current seed |
| AG11 | yes | yes | GHETTOS | 10 | -3 | 247 | 344 | AG11 | already in current seed |
| BD32 | yes | yes | BIG STUFF | 20 | -16 | 247 | 313 | BD32 | already in current seed |
| C4 | yes | yes | DONT USE | 0 | -1 | 246 | 303 | C4 | already in current seed |
| AC57 | yes | yes | MISC | 10 | -11 | 245 | 306 | AC57 | already in current seed |
| AB96 | yes | yes | VCRS | 10 | -19 | 245 | 303 | AB96 | already in current seed |
| AC56 | yes | yes | MISC | 10 | 1 | 244 | 310 | AC56 | already in current seed |
| TB2 | yes | yes | GHETTO | 20 | 18 | 244 | 310 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BQ41 | yes | yes | BABY ITEMS | 6 | -18 | 244 | 309 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB45 | yes | yes | JACKET | 20 | -23 | 244 | 267 | BB45 | already in current seed |
| RR'I | yes | yes | OTHER | 20 | -22 | 243 | 281 | RR-I | format: RR apostrophe -> RR hyphen |
| BC33 | yes | yes | MISCELLOUS | 0 | -20 | 242 | 314 | BC33 | already in current seed |
| C'7 | yes | yes | CAMERA | 0 | -47 | 242 | 289 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| B4 | yes | yes | VCR | 10 | 13 | 242 | 286 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG75 | yes | yes | OTHER | 20 | -11 | 241 | 315 | AG75 | already in current seed |
| BK71 | yes | yes | GUITAR | 9 | -27 | 241 | 311 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK81 | yes | yes | GUITAR | 9 | -27 | 240 | 292 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BT11 | yes | yes | MISC. | 10 | -15 | 240 | 287 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA11 | yes | yes | BIKE | 20 | -21 | 239 | 320 | BA11 | already in current seed |
| S13 | yes | yes | NINTENDO BOX | 5 | 7 | 239 | 274 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S11 | yes | yes | NINTENDO BOX | 5 | 6 | 238 | 278 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BQ31 | yes | yes | BABY ITEMS | 6 | -7 | 237 | 299 | BQ31 | already in current seed |
| BR21 | yes | yes | MISC. | 10 | -20 | 237 | 282 | BR21 | already in current seed |
| DV4 | yes | yes | GUITARS | 20 | 1 | 235 | 308 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| A4 | yes | no |  |  |  | 234 | 314 | UNKNOWN | approved: A1-A5 -> UNKNOWN |
| BF51 | yes | yes | STUFF | 9 | -32 | 234 | 314 | BF51 | already in current seed |
| FA42 | yes | yes | STEREO | 10 | -30 | 233 | 298 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T15 | yes | yes | TOOL BOX | 20 | 3 | 232 | 323 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG64 | yes | yes | OTHER | 20 | -11 | 232 | 308 | AG64 | already in current seed |
| BQ61 | yes | yes | BABY ITEMS | 6 | -16 | 232 | 286 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA57 | yes | yes | WALKMAN | 20 | -24 | 231 | 291 | AA57 | already in current seed |
| TA2 | yes | yes | GHETTO | 8 | 15 | 230 | 296 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S17 | yes | yes | NINTENDO BOX | 5 | 5 | 230 | 271 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA31 | yes | yes | JACKET | 20 | -21 | 229 | 318 | BA31 | already in current seed |
| BQ71 | yes | yes | BABY ITEMS | 6 | -21 | 229 | 294 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK91 | yes | yes | GUITAR | 9 | -19 | 229 | 284 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD33 | yes | yes | 20"  TV | 3 | -12 | 229 | 273 | AD33 | already in current seed |
| AE14 | yes | yes | 14" TV | 3 | -28 | 228 | 292 | AE14 | already in current seed |
| CAM4 | yes | no |  |  |  | 227 | 305 | C4 | approved: CAM1-CAM5 -> C1-C5 |
| AG51 | yes | yes | OTHER | 20 | -13 | 227 | 304 | AG51 | already in current seed |
| AD23 | yes | yes | 20" | 3 | -25 | 227 | 287 | AD23 | already in current seed |
| AB47 | yes | yes | VCRS | 10 | -16 | 226 | 266 | AB47 | already in current seed |
| BS21 | yes | yes | MISC. | 10 | -8 | 225 | 275 | BS21 | already in current seed |
| AG41 | yes | yes | OTHER | 20 | -11 | 224 | 318 | AG41 | already in current seed |
| TB3 | yes | yes | GHETTO | 20 | 18 | 224 | 278 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE21 | yes | yes | 28" TV | 3 | -16 | 224 | 272 | AE21 | already in current seed |
| T6 | yes | yes | TOOL BOX | 20 | 13 | 223 | 301 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| EA23 | yes | yes | COMPUTER | 7 | -27 | 223 | 268 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA43 | yes | yes | JACKET | 20 | -17 | 222 | 292 | BA43 | already in current seed |
| AE54 | yes | yes | 14" TV | 3 | -13 | 221 | 259 | AE54 | already in current seed |
| AC66 | yes | yes | TOOLS | 10 | 0 | 220 | 299 | AC66 | already in current seed |
| DA5 | yes | yes | FURNITURE | 4 | 17 | 220 | 246 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DV5 | yes | yes | GUITARS | 20 | 4 | 219 | 283 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA64 | yes | yes | KICKER BOX | 10 | -16 | 218 | 307 | AA64 | already in current seed |
| TE4 | yes | yes | GHETTO | 16 | 21 | 218 | 272 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC32 | yes | yes | MISCELLOUS | 20 | -23 | 217 | 280 | BC32 | already in current seed |
| BP71 | yes | yes | VACUUM CLEAN | 6 | -11 | 217 | 280 | BP71 | already in current seed |
| DV10 | yes | yes | VIOLIN,CARIN | 10 | 2 | 217 | 265 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB11 | yes | yes | MICROWAVE | 20 | -23 | 216 | 286 | BB11 | already in current seed |
| TE1 | yes | yes | GHETTO | 10 | 13 | 216 | 281 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| FA31 | yes | yes | STEREO | 10 | -18 | 216 | 279 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TD2 | yes | yes | GHETTO | 10 | 11 | 216 | 273 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA61 | yes | yes | CAR AMPS | 10 | -11 | 214 | 332 | AA61 | already in current seed |
| AA47 | yes | yes | CAR SPEAKERS | 20 | -13 | 214 | 298 | AA47 | already in current seed |
| BA32 | yes | yes | JACKET | 20 | -25 | 214 | 292 | BA32 | already in current seed |
| GA12 | yes | yes | STEREO | 10 | -20 | 214 | 276 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB10 | yes | no |  |  |  | 213 | 262 | UNKNOWN | approved: U-series -> UNKNOWN |
| AE94 | yes | yes | 14" TV | 3 | -15 | 213 | 253 | AE94 | already in current seed |
| BS31 | yes | yes | MISC. | 10 | -20 | 212 | 263 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| EA32 | yes | yes | COMPUTER | 5 | -8 | 212 | 242 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T8 | yes | yes | TOOL BOX | 20 | 15 | 211 | 296 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BP81 | yes | yes | VACUUM CLEAN | 6 | -24 | 211 | 283 | BP81 | already in current seed |
| BM41 | yes | yes | MISC | 10 | -15 | 211 | 268 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG46 | yes | yes | OTHER | 20 | -15 | 211 | 247 | AG46 | already in current seed |
| T10 | yes | yes | TOOL BOX | 20 | 17 | 210 | 282 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| FA32 | yes | yes | STEREO | 10 | -19 | 210 | 273 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BP51 | yes | yes | VACUUM CLEAN | 6 | -22 | 210 | 271 | BP51 | already in current seed |
| BA53 | yes | yes | JACKET | 20 | -24 | 210 | 268 | BA53 | already in current seed |
| T9 | yes | yes | TOOL BOX | 20 | 11 | 210 | 268 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DS11 | yes | yes | SM STEREO ST | 10 | 23 | 210 | 257 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| FA21 | yes | yes | STEREO | 10 | -21 | 209 | 273 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BM21 | yes | yes | MISC | 10 | -11 | 209 | 263 | BM21 | already in current seed |
| BA34 | yes | yes | JACKET | 20 | -13 | 209 | 260 | BA34 | already in current seed |
| BA52 | yes | yes | JACKET | 20 | -13 | 208 | 257 | BA52 | already in current seed |
| AE44 | yes | yes | 14" TV | 3 | -8 | 208 | 255 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BT31 | yes | yes | MISC. | 10 | -16 | 207 | 265 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| EA12 | yes | yes | COMPUTERS | 5 | -21 | 207 | 249 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DG3 | yes | yes | GOLF CLUB | 20 | 40 | 207 | 234 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BW11 | yes | yes | MISC | 5 | -10 | 206 | 283 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BR31 | yes | yes | MISC. | 10 | -18 | 206 | 259 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE51 | yes | yes | 28" TV | 3 | -25 | 206 | 246 | AE51 | already in current seed |
| GA32 | yes | yes | MICROWAVE | 10 | -22 | 205 | 262 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BQ21 | yes | yes | BABY ITEMS | 6 | -12 | 205 | 252 | BQ21 | already in current seed |
| AG83 | yes | yes | OTHER | 20 | -19 | 204 | 289 | AG83 | already in current seed |
| BC31 | yes | yes | MISCELLOUS | 20 | -16 | 204 | 266 | BC31 | already in current seed |
| BM31 | yes | yes | MISC | 10 | -16 | 204 | 262 | BM31 | already in current seed |
| AK61 | yes | yes | TV | 0 | -27 | 204 | 261 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| RR'Y | yes | yes | OTHER | 20 | -18 | 204 | 247 | RR-Y | format: RR apostrophe -> RR hyphen |
| AG72 | yes | yes | OTHER | 20 | -16 | 203 | 289 | AG72 | already in current seed |
| BA42 | yes | yes | JACKET | 20 | -27 | 203 | 261 | BA42 | already in current seed |
| FA41 | yes | yes | STEREO | 10 | -20 | 201 | 257 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| EA13 | yes | yes | COMPUTERS | 5 | -9 | 201 | 243 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BT41 | yes | yes | MISC. | 10 | -18 | 201 | 242 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L12 | yes | yes | 20" T.V. | 5 | 5 | 201 | 239 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB32 | yes | yes | JACKET | 20 | -19 | 200 | 269 | BB32 | already in current seed |
| UM6 | yes | yes | V.C. | 7 | 14 | 200 | 239 | UNKNOWN | approved: U-series -> UNKNOWN |
| TF1 | yes | yes | GHETTO | 15 | 10 | 200 | 234 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE93 | yes | yes | 20" TV | 3 | -18 | 200 | 226 | AE93 | already in current seed |
| GA22 | yes | yes | STEREO | 10 | -29 | 199 | 274 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T12 | yes | yes | TOOL BOX | 20 | 14 | 199 | 249 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE72 | yes | yes | STUFF | 9 | -19 | 199 | 237 | BE72 | already in current seed |
| R'N | yes | yes | RINGS | 100 | 6 | 198 | 277 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BG32 | yes | yes | STUFF | 9 | -20 | 198 | 263 | BG32 | already in current seed |
| AE33 | yes | yes | 20" TV | 3 | -20 | 198 | 244 | AE33 | already in current seed |
| RR'Q | yes | yes | OTHER | 20 | -30 | 198 | 228 | RR-Q | format: RR apostrophe -> RR hyphen |
| AG93 | yes | yes | OTHER | 20 | -18 | 197 | 276 | AG93 | already in current seed |
| AG62 | yes | yes | OTHER | 20 | -12 | 196 | 294 | AG62 | already in current seed |
| TA1 | yes | yes | GHETTO | 10 | 11 | 196 | 251 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE43 | yes | yes | 20" TV | 3 | -18 | 195 | 231 | AE43 | already in current seed |
| AG74 | yes | yes | OTHER | 20 | -29 | 194 | 287 | AG74 | already in current seed |
| BC13 | yes | yes | GOLF CLUB | 10 | -20 | 194 | 251 | BC13 | already in current seed |
| BB23 | yes | yes | CHAIN SAW | 20 | -18 | 193 | 275 | BB23 | already in current seed |
| C'6 | yes | yes | CAMERA | 0 | -22 | 193 | 228 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC22 | yes | yes | GOLF | 10 | -11 | 192 | 229 | BC22 | already in current seed |
| TA3 | yes | yes | GHETTO | 10 | 10 | 191 | 249 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB21 | yes | yes | JACKET | 20 | -30 | 190 | 257 | BB21 | already in current seed |
| TE3 | yes | yes | GHETTO | 10 | 12 | 190 | 252 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE74 | yes | yes | 14" TV | 3 | -24 | 190 | 223 | AE74 | already in current seed |
| BK12 | yes | yes | VACCUM | 9 | -15 | 189 | 230 | BK12 | already in current seed |
| AC46 | yes | yes | TOOLS | 10 | -4 | 188 | 250 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC41 | yes | yes | MISCELLOUS | 20 | -13 | 188 | 240 | BC41 | already in current seed |
| R'E | yes | yes | RINGS | 100 | 6 | 188 | 229 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BM22 | yes | yes | MISC | 10 | -23 | 187 | 251 | BM22 | already in current seed |
| FA43 | yes | yes | STEREO | 10 | -17 | 187 | 241 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S2 | yes | yes | NINTENDO BOX | 5 | 9 | 187 | 222 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BR51 | yes | yes | MISC. | 10 | -19 | 186 | 232 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB97 | yes | yes | VCRS | 10 | -5 | 186 | 220 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S21 | yes | yes | NINTENDO BOX | 5 | 5 | 186 | 211 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TF2 | yes | yes | GHETTO | 15 | 5 | 185 | 239 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB57 | yes | yes | VCRS | 10 | -11 | 185 | 220 | AB57 | already in current seed |
| TC1 | yes | yes | GHETTO | 10 | 11 | 184 | 233 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE73 | yes | yes | 20" TV | 3 | -12 | 184 | 218 | AE73 | already in current seed |
| S16 | yes | yes | NINTENDO BOX | 5 | 7 | 184 | 212 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| HA22 | yes | yes | BIG ITEMS | 9 | -17 | 183 | 247 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BX21 | yes | yes | MISC | 5 | -24 | 183 | 238 | BX21 | already in current seed |
| AG94 | yes | yes | OTHER | 20 | -6 | 182 | 248 | AG94 | already in current seed |
| BA22 | yes | yes | JACKET | 20 | -18 | 182 | 241 | BA22 | already in current seed |
| BC53 | yes | yes | BIG STUFF | 20 | -20 | 182 | 236 | BC53 | already in current seed |
| BB34 | yes | yes | HUNTING BOW | 10 | -14 | 182 | 221 | BB34 | already in current seed |
| F 4 | yes | yes | FURNITURE | 30 | -57 | 181 | 290 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD33 | yes | yes | BIG STUFF | 20 | -12 | 181 | 240 | BD33 | already in current seed |
| BE61 | yes | yes | STUFF | 9 | -15 | 181 | 232 | BE61 | already in current seed |
| BR61 | yes | yes | MISC. | 10 | -24 | 181 | 223 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA23 | yes | yes | JACKET | 20 | -28 | 180 | 249 | BA23 | already in current seed |
| GA31 | yes | yes | MICROWAVE | 10 | -27 | 180 | 237 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| C'8 | yes | yes | CAMERA | 0 | -28 | 180 | 214 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S23 | yes | yes | NINTENDO BOX | 5 | 6 | 180 | 206 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| HA12 | yes | yes | BIG ITEMS | 9 | -23 | 179 | 258 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG85 | yes | yes | OTHER | 20 | -13 | 179 | 237 | AG85 | already in current seed |
| BT51 | yes | yes | MISC. | 10 | -17 | 178 | 226 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD54 | yes | yes | 14" TV | 3 | -11 | 178 | 219 | AD54 | already in current seed |
| L38 | yes | yes | 20" T.V. | 7 | 15 | 178 | 219 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE61 | yes | yes | 28" TV | 3 | -16 | 177 | 241 | AE61 | already in current seed |
| TD1 | yes | yes | GHETTO | 10 | 5 | 177 | 232 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BU31 | yes | yes | MISC. | 5 | -15 | 177 | 224 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L20 | yes | yes | 20" T.V. | 5 | 5 | 177 | 215 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF31 | yes | yes | STUFF | 9 | -11 | 176 | 220 | BF31 | already in current seed |
| DV2 | yes | yes | DRUM & GUITA | 20 | 0 | 176 | 217 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DA3 | yes | yes | FURNITURE | 4 | 19 | 176 | 209 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA51 | yes | yes | JACKET | 20 | -19 | 175 | 238 | BA51 | already in current seed |
| T19 | yes | yes | CHAIN SAW | 20 | 14 | 174 | 236 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DV6 | yes | yes | GUITARS | 15 | 4 | 174 | 211 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S4 | yes | yes | NINTENDO BOX | 5 | 7 | 174 | 210 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S14 | yes | yes | NINTENDO BOX | 4 | 5 | 174 | 199 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA13 | yes | yes | JACKET | 20 | -14 | 173 | 233 | BA13 | already in current seed |
| L22 | yes | yes | 26" T.V. | 4 | 4 | 173 | 207 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T7 | yes | yes | TOOL BOX | 20 | 18 | 172 | 254 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T21 | yes | yes | TOOL BOX | 20 | 3 | 172 | 225 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U1 | yes | no |  |  |  | 172 | 214 | UNKNOWN | approved: U-series -> UNKNOWN |
| AE83 | yes | yes | 20" TV | 3 | -21 | 172 | 209 | AE83 | already in current seed |
| BE12 | yes | yes | GUITAR | 6 | -18 | 171 | 218 | BE12 | already in current seed |
| AE81 | yes | yes | 28" TV | 3 | -24 | 171 | 216 | AE81 | already in current seed |
| S15 | yes | yes | NINTENDO BOX | 5 | 7 | 171 | 206 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA28 | yes | no |  |  |  | 171 | 190 | UNKNOWN | approved: U-series -> UNKNOWN |
| BE41 | yes | yes | STUFF | 9 | -20 | 170 | 221 | BE41 | already in current seed |
| AE53 | yes | yes | 20" TV | 3 | -18 | 170 | 218 | AE53 | already in current seed |
| BW41 | yes | yes | MISC | 5 | -15 | 170 | 194 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC12 | yes | yes | GOLF CLUB | 10 | -21 | 169 | 227 | BC12 | already in current seed |
| BA12 | yes | yes | JACKET | 20 | -26 | 169 | 224 | BA12 | already in current seed |
| BA61 | yes | yes | JACKET | 20 | -33 | 169 | 216 | BA61 | already in current seed |
| GA21 | yes | yes | STEREO | 10 | -20 | 168 | 224 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE32 | yes | yes | STUFF | 9 | -23 | 168 | 216 | BE32 | already in current seed |
| BD42 | yes | yes | BIG STUFF | 20 | -18 | 168 | 207 | BD42 | already in current seed |
| DS5 | yes | yes | DECK & AMP | 12 | 9 | 168 | 207 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG61 | yes | yes | OTHER | 20 | -27 | 167 | 250 | AG61 | already in current seed |
| T11 | yes | yes | TOOL BOX | 2 | 13 | 167 | 241 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD1 | yes | no |  |  |  | 167 | 237 | UNKNOWN | approved: U-series -> UNKNOWN |
| BB43 | yes | yes | JACKET | 20 | -29 | 167 | 225 | BB43 | already in current seed |
| BF41 | yes | yes | STUFF | 9 | -15 | 167 | 203 | BF41 | already in current seed |
| BN32 | yes | yes | MISC | 10 | -9 | 167 | 203 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BACK | yes | no |  |  |  | 166 | 347 | UNKNOWN | approved: BACK -> UNKNOWN |
| BG42 | yes | yes | STUFF | 9 | -3 | 166 | 206 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T4 | yes | yes | TOOL BOX | 20 | 9 | 165 | 233 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BM12 | yes | yes | MISC | 10 | -6 | 165 | 213 | BM12 | already in current seed |
| UA1 | yes | no |  |  |  | 165 | 208 | UNKNOWN | approved: U-series -> UNKNOWN |
| AE22 | yes | yes | 20" TV | 3 | -20 | 165 | 206 | AE22 | already in current seed |
| L11 | yes | yes | 14" T.V. | 6 | 3 | 165 | 201 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG21 | yes | yes | GHETTOS | 10 | -11 | 164 | 258 | AG21 | already in current seed |
| FA13 | yes | yes | STEREO | 10 | -7 | 164 | 219 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE71 | yes | yes | STUFF | 9 | -12 | 164 | 207 | BE71 | already in current seed |
| AG84 | yes | yes | OTHER | 20 | -13 | 163 | 255 | AG84 | already in current seed |
| BG51 | yes | yes | STUFF | 9 | -20 | 163 | 235 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BG22 | yes | yes | STUFF | 9 | -21 | 163 | 211 | BG22 | already in current seed |
| S1 | yes | yes | NINTENDO BOX | 5 | 8 | 163 | 205 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| F4 | yes | yes | CAR AMP | 40 | 20 | 161 | 272 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T5 | yes | yes | TOOL BOX | 20 | 5 | 161 | 246 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| CAM5 | yes | no |  |  |  | 161 | 229 | C5 | approved: CAM1-CAM5 -> C1-C5 |
| BU21 | yes | yes | MISC. | 5 | -19 | 161 | 221 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA41 | yes | yes | JACKET | 20 | -21 | 161 | 218 | BA41 | already in current seed |
| S18 | yes | yes | NINTENDO BOX | 5 | 6 | 161 | 195 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BU11 | yes | yes | MISC. | 5 | -19 | 160 | 222 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S12 | yes | yes | NINTENDO BOX | 5 | 6 | 160 | 194 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S3 | yes | yes | NINTENDO BOX | 5 | 7 | 160 | 189 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S7 | yes | yes | NINTENDO BOX | 5 | 7 | 160 | 188 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB1 | yes | no |  |  |  | 159 | 207 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB3 | yes | no |  |  |  | 159 | 205 | UNKNOWN | approved: U-series -> UNKNOWN |
| DS12 | yes | yes | BIG STEREO | 5 | 18 | 158 | 201 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UL8 | yes | no |  |  |  | 158 | 195 | UNKNOWN | approved: U-series -> UNKNOWN |
| BE42 | yes | yes | STUFF | 9 | -21 | 157 | 205 | BE42 | already in current seed |
| UB8 | yes | no |  |  |  | 157 | 187 | UNKNOWN | approved: U-series -> UNKNOWN |
| BB41 | yes | yes | JACKET | 20 | -17 | 156 | 221 | BB41 | already in current seed |
| BA44 | yes | yes | JACKET | 20 | -17 | 156 | 206 | BA44 | already in current seed |
| L21 | yes | yes | 20" T.V. | 9 | 6 | 156 | 206 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD41 | yes | yes | BIG STUFF | 20 | -9 | 156 | 195 | BD41 | already in current seed |
| T3 | yes | yes | TOOL BOX | 20 | 13 | 155 | 229 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA21 | yes | yes | JACKET | 20 | -17 | 155 | 214 | BA21 | already in current seed |
| BC44 | yes | yes | OTHER | 20 | -10 | 155 | 200 | BC44 | already in current seed |
| BC52 | yes | yes | BIG STUFF | 20 | -18 | 155 | 198 | BC52 | already in current seed |
| DM1 | yes | yes | MICROWAVE | 5 | 5 | 155 | 190 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L28 | yes | yes | 26" T.V. | 5 | 3 | 155 | 181 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T1 | yes | yes | TOOL BOX | 20 | 4 | 154 | 229 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG71 | yes | yes | OTHER | 20 | -10 | 154 | 226 | AG71 | already in current seed |
| AB17 | yes | yes | OTHER | 0 | -12 | 154 | 212 | AB17 | already in current seed |
| BC21 | yes | yes | GOLF CLUB | 10 | -12 | 154 | 193 | BC21 | already in current seed |
| AD83 | yes | yes | 20" TV | 3 | -20 | 154 | 187 | AD83 | already in current seed |
| UB5 | yes | no |  |  |  | 153 | 230 | UNKNOWN | approved: U-series -> UNKNOWN |
| GA42 | yes | yes | MICROWAVE | 10 | -27 | 153 | 209 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC14 | yes | yes | GOLF CLUB | 10 | -13 | 153 | 197 | BC14 | already in current seed |
| BE43 | yes | yes | STUFF | 9 | -15 | 152 | 194 | BE43 | already in current seed |
| BC73 | yes | yes | BIG STUFF | 20 | -18 | 152 | 187 | BC73 | already in current seed |
| BE81 | yes | yes | STUFF | 9 | -20 | 152 | 185 | BE81 | already in current seed |
| BD73 | yes | yes | BIG STUFF | 20 | -13 | 152 | 184 | BD73 | already in current seed |
| UB33 | yes | no |  |  |  | 152 | 164 | UNKNOWN | approved: U-series -> UNKNOWN |
| UE3 | yes | no |  |  |  | 151 | 234 | UNKNOWN | approved: U-series -> UNKNOWN |
| DC3 | yes | yes | BIG STEREO | 5 | 36 | 151 | 186 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE31 | yes | yes | STUFF | 9 | -11 | 150 | 201 | BE31 | already in current seed |
| BG33 | yes | yes | STUFF | 9 | -19 | 150 | 197 | BG33 | already in current seed |
| BF23 | yes | yes | STUFF | 9 | -21 | 150 | 181 | BF23 | already in current seed |
| S10 | yes | yes | NINTENDO BOX | 5 | 6 | 150 | 173 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD43 | yes | yes | V | 20 | -18 | 149 | 192 | BD43 | already in current seed |
| BN52 | yes | yes | MISC | 10 | -10 | 149 | 192 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD13 | yes | yes | BIG STUFF | 20 | -6 | 149 | 186 | BD13 | already in current seed |
| BD14 | yes | yes | BIG STUFF | 20 | -14 | 149 | 184 | BD14 | already in current seed |
| UA3 | yes | no |  |  |  | 149 | 182 | UNKNOWN | approved: U-series -> UNKNOWN |
| M4 | yes | yes | 33" T.V. | 4 | 2 | 149 | 171 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE22 | yes | yes | GUITAR | 6 | -13 | 148 | 203 | BE22 | already in current seed |
| BD61 | yes | yes | BIG STUFF | 20 | -10 | 148 | 198 | BD61 | already in current seed |
| BD23 | yes | yes | BIG STUFF | 20 | -12 | 148 | 187 | BD23 | already in current seed |
| GA13 | yes | yes | STEREO | 10 | -14 | 148 | 187 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BT21 | yes | yes | MISC. | 10 | -13 | 148 | 186 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BG72 | yes | yes | MISC. | 5 | -22 | 148 | 184 | BG72 | already in current seed |
| BM32 | yes | yes | MISC | 10 | -8 | 148 | 170 | BM32 | already in current seed |
| FU1 | yes | yes | Furniture 2 | 10 | -29 | 147 | 205 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG95 | yes | yes | OTHER | 20 | -5 | 147 | 204 | AG95 | already in current seed |
| BC42 | yes | yes | MISCELLOUS | 0 | -15 | 147 | 198 | BC42 | already in current seed |
| BN31 | yes | yes | MISC | 10 | -16 | 147 | 189 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DS8 | yes | yes | DECK & AMP | 18 | 16 | 147 | 184 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE33 | yes | yes | STUFF | 9 | -16 | 146 | 195 | BE33 | already in current seed |
| L13 | yes | yes | 20" T.V. | 4 | 8 | 146 | 182 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE84 | yes | yes | 14" TV | 3 | -14 | 146 | 181 | AE84 | already in current seed |
| EA33 | yes | yes | COMPUTER | 5 | -18 | 146 | 181 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BV23 | yes | yes | MISC. | 5 | -11 | 146 | 175 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UL7 | yes | no |  |  |  | 146 | 171 | UNKNOWN | approved: U-series -> UNKNOWN |
| BC62 | yes | yes | BIG STUFF | 20 | -13 | 145 | 186 | BC62 | already in current seed |
| M3 | yes | yes | 20" T.V. | 5 | 3 | 145 | 172 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T16 | yes | yes | TOOL BOX | 20 | 15 | 144 | 215 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| FU2 | yes | yes | Furniture 2 | 10 | -13 | 144 | 206 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T20 | yes | yes | TOOL BOX | 20 | 5 | 144 | 198 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF13 | yes | yes | STUFF | 9 | -10 | 144 | 184 | BF13 | already in current seed |
| BV41 | yes | yes | MISC. | 5 | -15 | 144 | 176 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK82 | yes | yes | GUITAR | 9 | -9 | 144 | 168 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF21 | yes | yes | STUFF | 9 | -11 | 143 | 191 | BF21 | already in current seed |
| BE52 | yes | yes | STUFF | 9 | -10 | 143 | 176 | BE52 | already in current seed |
| BV14 | yes | yes | MISC. | 5 | -7 | 143 | 174 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BV13 | yes | yes | MISC. | 5 | -9 | 143 | 172 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM4 | yes | yes | MICROWAVE | 10 | 4 | 143 | 170 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY21 | yes | yes | TV | 20 | 4 | 142 | 202 | AY21 | already in current seed |
| BC23 | yes | yes | SMALL ITEM | 20 | -10 | 142 | 196 | BC23 | already in current seed |
| AY12 | yes | yes | TV | 20 | 1 | 142 | 188 | AY12 | already in current seed |
| FA23 | yes | yes | STEREO | 10 | -12 | 142 | 183 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AF87 | yes | yes | OTHER | 20 | -10 | 142 | 179 | AF87 | already in current seed |
| BG23 | yes | yes | STUFF | 9 | -9 | 142 | 179 | BG23 | already in current seed |
| BF12 | yes | yes | STUFF | 9 | -11 | 142 | 178 | BF12 | already in current seed |
| BE23 | yes | yes | STUFF | 9 | -9 | 141 | 187 | BE23 | already in current seed |
| BS41 | yes | yes | MISC. | 10 | -18 | 141 | 186 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BS51 | yes | yes | MISC. | 10 | -15 | 141 | 184 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD52 | yes | yes | BIG STUFF | 20 | -6 | 141 | 181 | BD52 | already in current seed |
| S8 | yes | yes | NINTENDO BOX | 5 | 6 | 141 | 177 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BV43 | yes | yes | MISC. | 5 | -16 | 141 | 174 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BN53 | yes | yes | MISC | 10 | -16 | 141 | 173 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BR41 | yes | yes | MISC. | 10 | -15 | 140 | 184 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BN43 | yes | yes | MISC | 10 | -12 | 140 | 179 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L39 | yes | yes | 20" T.V. | 7 | 2 | 140 | 177 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD24 | yes | yes | BIG STUFF | 20 | -14 | 140 | 172 | BD24 | already in current seed |
| BK62 | yes | yes | GUITAR | 9 | -14 | 140 | 166 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L8 | yes | yes | 20" T.V. | 4 | 2 | 140 | 159 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG81 | yes | yes | OTHER | 20 | -8 | 139 | 198 | AG81 | already in current seed |
| BA62 | yes | yes | JACKET | 20 | -12 | 139 | 183 | BA62 | already in current seed |
| BE62 | yes | yes | STUFF | 9 | -15 | 139 | 177 | BE62 | already in current seed |
| BN42 | yes | yes | MISC | 10 | -10 | 139 | 176 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF72 | yes | yes | STUFF | 9 | -14 | 139 | 175 | BF72 | already in current seed |
| S6 | yes | yes | NINTENDO BOX | 5 | 7 | 139 | 166 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BM42 | yes | yes | MISC | 10 | -3 | 139 | 163 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA7 | yes | no |  |  |  | 139 | 162 | UNKNOWN | approved: U-series -> UNKNOWN |
| UA27 | yes | no |  |  |  | 139 | 156 | UNKNOWN | approved: U-series -> UNKNOWN |
| BC43 | yes | yes | OTHER | 0 | -16 | 138 | 179 | BC43 | already in current seed |
| BG43 | yes | yes | STUFF | 9 | -13 | 138 | 176 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BG63 | yes | yes | STUFF | 9 | -18 | 138 | 169 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L1 | yes | yes | 20" TV | 5 | 2 | 138 | 165 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S5 | yes | yes | NINTENDO BOX | 5 | 7 | 138 | 162 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| HA31 | yes | yes | BIG ITEMS | 9 | -22 | 137 | 190 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BG41 | yes | yes | STUFF | 9 | -10 | 137 | 181 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA83 | yes | yes | JACKET | 20 | -8 | 137 | 162 | BA83 | already in current seed |
| L42 | yes | yes | 20" T.V. | 4 | 0 | 137 | 161 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DV3 | yes | yes | MUSIC INSTR. | 30 | -8 | 136 | 190 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF32 | yes | yes | STUFF | 9 | -16 | 136 | 189 | BF32 | already in current seed |
| U12 | yes | no |  |  |  | 136 | 165 | UNKNOWN | approved: U-series -> UNKNOWN |
| AG82 | yes | yes | OTHER | 20 | -13 | 135 | 205 | AG82 | already in current seed |
| BE53 | yes | yes | STUFF | 9 | -4 | 135 | 169 | BE53 | already in current seed |
| BV33 | yes | yes | MISC. | 5 | -19 | 135 | 166 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD53 | yes | yes | BIG STUFF | 20 | -14 | 134 | 179 | BD53 | already in current seed |
| AC37 | yes | yes | OTHER | 20 | -3 | 134 | 173 | AC37 | already in current seed |
| L4 | yes | yes | 20" T.V. | 4 | 4 | 134 | 166 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L2 | yes | yes | 20" T.V. | 5 | 3 | 134 | 165 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L31 | yes | yes | 20" T.V. | 4 | 6 | 134 | 161 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| HA32 | yes | yes | BIG ITEMS | 9 | -17 | 133 | 185 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA14 | yes | yes | JACKET | 20 | -18 | 133 | 182 | BA14 | already in current seed |
| BE21 | yes | yes | GUITAR | 6 | -20 | 133 | 179 | BE21 | already in current seed |
| AD44 | yes | yes | 14" TV | 3 | -4 | 133 | 178 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB66 | yes | yes | VCRS | 10 | -11 | 133 | 162 | AB66 | already in current seed |
| UF11 | yes | no |  |  |  | 132 | 201 | UNKNOWN | approved: U-series -> UNKNOWN |
| AG92 | yes | yes | OTHER | 20 | -5 | 132 | 195 | AG92 | already in current seed |
| BG31 | yes | yes | STUFF | 9 | -13 | 132 | 182 | BG31 | already in current seed |
| AF77 | yes | yes | OTHER | 20 | -16 | 132 | 162 | AF77 | already in current seed |
| AG91 | yes | yes | OTHER | 20 | -8 | 131 | 180 | AG91 | already in current seed |
| BD31 | yes | yes | BIG STUFF | 20 | -11 | 131 | 180 | BD31 | already in current seed |
| AE91 | yes | yes | 28" TV | 3 | -9 | 131 | 166 | AE91 | already in current seed |
| U10 | yes | no |  |  |  | 131 | 163 | UNKNOWN | approved: U-series -> UNKNOWN |
| DC2 | yes | yes | MID STEREO | 5 | 12 | 131 | 162 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AK33 | yes | yes | LARGE TV | 6 | -8 | 131 | 161 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB12 | yes | yes | JACKET | 20 | -24 | 130 | 174 | BB12 | already in current seed |
| BE63 | yes | yes | STUFF | 9 | -12 | 130 | 170 | BE63 | already in current seed |
| L41 | yes | yes | 14" T.V. | 3 | 3 | 130 | 164 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD93 | yes | yes | 20" TV | 3 | -15 | 130 | 161 | AD93 | already in current seed |
| UB4 | yes | no |  |  |  | 130 | 158 | UNKNOWN | approved: U-series -> UNKNOWN |
| BB52 | yes | yes | JACKET | 20 | -30 | 129 | 168 | BB52 | already in current seed |
| BA24 | yes | yes | JACKET | 20 | -17 | 129 | 166 | BA24 | already in current seed |
| TB1 | yes | yes | GHETTO | 8 | 15 | 129 | 164 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L27 | yes | yes | 20" T.V. | 5 | 4 | 129 | 157 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L9 | yes | yes | 20" T.V. | 3 | 5 | 129 | 151 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD64 | yes | yes | 14" TV | 3 | -12 | 128 | 164 | AD64 | already in current seed |
| S20 | yes | yes | NINTENDO BOX | 5 | 6 | 128 | 160 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD71 | yes | yes | BIG STUFF | 20 | -7 | 128 | 157 | BD71 | already in current seed |
| HA41 | yes | yes | BIG ITEMS | 9 | -24 | 127 | 199 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD22 | yes | yes | BIG STUFF | 20 | -18 | 127 | 172 | BD22 | already in current seed |
| BN62 | yes | yes | MISC | 10 | -9 | 127 | 162 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U14 | yes | no |  |  |  | 127 | 155 | UNKNOWN | approved: U-series -> UNKNOWN |
| L32 | yes | yes | 20" T.V. | 4 | 5 | 127 | 149 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| FU3 | yes | yes | Furniture 2 | 10 | -23 | 126 | 182 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BS61 | yes | yes | MISC. | 10 | -7 | 126 | 163 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S19 | yes | yes | NINTENDO BOX | 5 | 6 | 126 | 160 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM3 | yes | yes | MICROWAVE | 5 | 5 | 126 | 148 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'V | yes | yes | RINGS | 100 | 12 | 125 | 160 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC17 | yes | yes | OTHER | 20 | -6 | 125 | 159 | AC17 | already in current seed |
| BC64 | yes | yes | BIG STUFF | 20 | -17 | 125 | 158 | BC64 | already in current seed |
| DM2 | yes | yes | MICROWAVE | 5 | 5 | 125 | 150 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M10 | yes | yes | 20" T.V. | 4 | 4 | 125 | 139 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA26 | yes | no |  |  |  | 125 | 137 | UNKNOWN | approved: U-series -> UNKNOWN |
| DB10 | yes | yes | FURNITURE | 5 | 9 | 125 | 136 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD62 | yes | yes | BIG STUFF | 20 | -6 | 124 | 167 | BD62 | already in current seed |
| BC63 | yes | yes | BIG STUFF | 20 | -12 | 124 | 160 | BC63 | already in current seed |
| BL53 | yes | yes | MISC. | 9 | -11 | 124 | 158 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L5 | yes | yes | 20" T.V. | 4 | 1 | 124 | 157 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| S22 | yes | yes | NINTENDO BOX | 5 | 5 | 124 | 152 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF43 | yes | yes | STUFF | 9 | -11 | 123 | 166 | BF43 | already in current seed |
| BD12 | yes | yes | BIG STUFF | 20 | -15 | 123 | 164 | BD12 | already in current seed |
| BV22 | yes | yes | MISC. | 5 | -11 | 123 | 160 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY11 | yes | yes | TV | 20 | 5 | 122 | 178 | AY11 | already in current seed |
| BC34 | yes | yes | OTHER | 0 | -14 | 122 | 168 | BC34 | already in current seed |
| BB42 | yes | yes | JACKET | 20 | -13 | 122 | 163 | BB42 | already in current seed |
| BV32 | yes | yes | MISC. | 5 | -16 | 122 | 155 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC72 | yes | yes | BIG STUFF | 20 | -14 | 122 | 153 | BC72 | already in current seed |
| L19 | yes | yes | 14" T.V. | 6 | 8 | 122 | 151 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U11 | yes | no |  |  |  | 122 | 147 | UNKNOWN | approved: U-series -> UNKNOWN |
| FU5 | yes | yes | Furniture 2 | 20 | -24 | 121 | 181 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| HA13 | yes | yes | BIG ITEMS | 9 | -12 | 121 | 167 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE32 | yes | yes | 20" TV | 3 | -3 | 121 | 152 | AE32 | already in current seed |
| BD72 | yes | yes | BIG STUFF | 20 | -7 | 121 | 151 | BD72 | already in current seed |
| AF97 | yes | yes | OTHER | 20 | -7 | 121 | 150 | AF97 | already in current seed |
| AK63 | yes | yes | TV | 0 | -20 | 121 | 146 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L23 | yes | yes | 20" T.V. | 4 | 5 | 121 | 146 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M2 | yes | yes | 20" T.V. | 5 | 3 | 121 | 144 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE82 | yes | yes | STUFF | 9 | -9 | 120 | 149 | BE82 | already in current seed |
| GA41 | yes | yes | MICROWAVE | 10 | -17 | 119 | 181 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BN33 | yes | yes | MISC | 10 | -14 | 119 | 162 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BN63 | yes | yes | MISC | 10 | -12 | 119 | 155 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF22 | yes | yes | STUFF | 9 | -15 | 119 | 154 | BF22 | already in current seed |
| BB35 | yes | yes | JACKET | 20 | -12 | 119 | 143 | BB35 | already in current seed |
| BW61 | yes | yes | MISC | 5 | -20 | 119 | 134 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| HA21 | yes | yes | BIG ITEMS | 9 | -31 | 118 | 195 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF33 | yes | yes | STUFF | 9 | -21 | 118 | 181 | BF33 | already in current seed |
| GA43 | yes | yes | MICROWAVE | 10 | -13 | 118 | 158 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD73 | yes | yes | 20' TV | 3 | -8 | 118 | 149 | AD73 | already in current seed |
| BB14 | yes | yes | JACKET | 20 | -6 | 118 | 149 | BB14 | already in current seed |
| TD4 | yes | yes | GHETTO | 5 | 14 | 118 | 141 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L24 | yes | yes | 20" T.V. | 4 | 5 | 118 | 137 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA29 | yes | no |  |  |  | 118 | 132 | UNKNOWN | approved: U-series -> UNKNOWN |
| GA23 | yes | yes | STEREO | 10 | -13 | 117 | 154 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| LF | yes | yes | TV | 100 | -19 | 116 | 175 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD63 | yes | yes | BIG STUFF | 20 | -11 | 116 | 159 | BD63 | already in current seed |
| U34 | yes | no |  |  |  | 116 | 145 | UNKNOWN | approved: U-series -> UNKNOWN |
| BG62 | yes | yes | STUFF | 9 | -15 | 116 | 144 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U15 | yes | no |  |  |  | 116 | 143 | UNKNOWN | approved: U-series -> UNKNOWN |
| BD82 | yes | yes | OTHER | 0 | -10 | 116 | 139 | BD82 | already in current seed |
| DS7 | yes | yes | SM STEREO ST | 9 | 10 | 116 | 139 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB29 | yes | no |  |  |  | 116 | 131 | UNKNOWN | approved: U-series -> UNKNOWN |
| BF52 | yes | yes | STUFF | 9 | -13 | 115 | 153 | BF52 | already in current seed |
| BL42 | yes | yes | MISC. | 9 | -9 | 115 | 150 | BL42 | already in current seed |
| BG13 | yes | yes | STUFF | 9 | -11 | 115 | 149 | BG13 | already in current seed |
| AK32 | yes | yes | LARGE TV | 6 | -8 | 115 | 143 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BW13 | yes | yes | MISC | 5 | -11 | 115 | 132 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BL43 | yes | yes | MISC. | 9 | -12 | 114 | 152 | BL43 | already in current seed |
| BB22 | yes | yes | FISHING EQUI | 30 | -2 | 114 | 148 | BB22 | already in current seed |
| DC6 | yes | yes | BIG STEREO | 5 | 25 | 114 | 148 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U9 | yes | no |  |  |  | 114 | 140 | UNKNOWN | approved: U-series -> UNKNOWN |
| DC5 | yes | yes | MID STEREO | 5 | 13 | 114 | 136 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB13 | yes | no |  |  |  | 114 | 134 | UNKNOWN | approved: U-series -> UNKNOWN |
| DS4 | yes | yes | DECK & AMP | 12 | 19 | 113 | 134 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U19 | yes | no |  |  |  | 113 | 134 | UNKNOWN | approved: U-series -> UNKNOWN |
| M7 | yes | yes | 20" T.V. | 4 | 4 | 113 | 126 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UG13 | yes | no |  |  |  | 112 | 161 | UNKNOWN | approved: U-series -> UNKNOWN |
| L14 | yes | yes | 20" T.V. | 5 | 2 | 112 | 140 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DG2 | yes | yes | GOLF CLUB | 20 | 22 | 112 | 136 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U35 | yes | no |  |  |  | 112 | 136 | UNKNOWN | approved: U-series -> UNKNOWN |
| BF42 | yes | yes | STUFF | 9 | -13 | 111 | 148 | BF42 | already in current seed |
| BC71 | yes | yes | BIG STUFF | 20 | -17 | 111 | 143 | BC71 | already in current seed |
| BL52 | yes | yes | MISC. | 9 | -15 | 111 | 139 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'U | yes | yes | RINGS | 100 | 4 | 111 | 130 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M6 | yes | yes | 20" T.V. | 4 | 5 | 111 | 123 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC24 | yes | yes | GOLF CLUB | 20 | -13 | 110 | 146 | BC24 | already in current seed |
| AE52 | yes | yes | 20" TV | 3 | -6 | 110 | 134 | AE52 | already in current seed |
| BB51 | yes | yes | JACKET | 20 | -9 | 109 | 167 | BB51 | already in current seed |
| BF81 | yes | yes | STUFF | 9 | -14 | 109 | 146 | BF81 | already in current seed |
| BG52 | yes | yes | STUFF | 9 | -13 | 109 | 144 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG76 | yes | yes | OTHER | 20 | -2 | 109 | 138 | AG76 | already in current seed |
| L6 | yes | yes | 20" T.V. | 5 | 3 | 109 | 136 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA71 | yes | yes | JACKET | 20 | -18 | 109 | 135 | BA71 | already in current seed |
| L17 | yes | yes | 20" T.V. | 3 | 3 | 109 | 134 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L15 | yes | yes | 14" T.V. | 4 | 3 | 109 | 132 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M8 | yes | yes | 33" T.V. | 4 | 1 | 109 | 127 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA30 | yes | no |  |  |  | 109 | 122 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB26 | yes | no |  |  |  | 109 | 121 | UNKNOWN | approved: U-series -> UNKNOWN |
| BL12 | yes | yes | GUITAR | 9 | -16 | 108 | 135 | BL12 | already in current seed |
| L29 | yes | yes | 26" T.V. | 4 | 2 | 108 | 129 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U29 | yes | no |  |  |  | 108 | 127 | UNKNOWN | approved: U-series -> UNKNOWN |
| AC27 | yes | yes | OTHER | 20 | -4 | 107 | 146 | AC27 | already in current seed |
| BF61 | yes | yes | STUFF | 9 | -5 | 107 | 141 | BF61 | already in current seed |
| AD63 | yes | yes | 20" TV | 3 | 0 | 107 | 136 | AD63 | already in current seed |
| AK43 | yes | yes | LARGE TV | 6 | -5 | 107 | 136 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BG53 | yes | yes | STUFF | 9 | -15 | 107 | 135 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB27 | yes | no |  |  |  | 107 | 132 | UNKNOWN | approved: U-series -> UNKNOWN |
| BX42 | yes | yes | MISC | 5 | -6 | 107 | 131 | BX42 | already in current seed |
| BC74 | yes | yes | BIG STUFF | 20 | -12 | 107 | 129 | BC74 | already in current seed |
| UB36 | yes | no |  |  |  | 107 | 124 | UNKNOWN | approved: U-series -> UNKNOWN |
| DS9 | yes | yes | BIG STEREO S | 5 | 20 | 107 | 122 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD21 | yes | yes | BIG STUFF | 20 | -10 | 106 | 153 | BD21 | already in current seed |
| BC61 | yes | yes | BIG STUFF | 20 | -13 | 106 | 147 | BC61 | already in current seed |
| R20 | yes | yes | TOOLS | 5 | 3 | 106 | 147 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UM | yes | yes | V.C. | 200 | -8 | 106 | 138 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB2 | yes | no |  |  |  | 106 | 133 | UNKNOWN | approved: U-series -> UNKNOWN |
| BB53 | yes | yes | JACKET | 20 | -4 | 106 | 131 | BB53 | already in current seed |
| AK13 | yes | yes | LARGE TV | 6 | -4 | 106 | 130 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BV42 | yes | yes | MISC. | 5 | -6 | 106 | 130 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD54 | yes | yes | BIG STUFF | 20 | -14 | 106 | 127 | BD54 | already in current seed |
| U26 | yes | no |  |  |  | 106 | 126 | UNKNOWN | approved: U-series -> UNKNOWN |
| BV11 | yes | yes | MISC. | 5 | -2 | 106 | 122 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA12 | yes | no |  |  |  | 106 | 122 | UNKNOWN | approved: U-series -> UNKNOWN |
| AK42 | yes | yes | LARGE TV | 6 | -9 | 106 | 121 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA17 | yes | no |  |  |  | 106 | 121 | UNKNOWN | approved: U-series -> UNKNOWN |
| AY22 | yes | yes | TV | 20 | 14 | 105 | 148 | AY22 | already in current seed |
| BV31 | yes | yes | MISC. | 5 | -9 | 105 | 137 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BN51 | yes | yes | MISC | 10 | -11 | 105 | 135 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD81 | yes | yes | OTHER | 0 | -8 | 105 | 131 | BD81 | already in current seed |
| DB13 | yes | yes | FURNITURE | 5 | 16 | 105 | 125 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L10 | yes | yes | 26" T.V. | 4 | 4 | 105 | 124 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB22 | yes | no |  |  |  | 105 | 111 | UNKNOWN | approved: U-series -> UNKNOWN |
| UF2 | yes | no |  |  |  | 104 | 175 | UNKNOWN | approved: U-series -> UNKNOWN |
| BF53 | yes | yes | STUFF | 9 | -13 | 104 | 146 | BF53 | already in current seed |
| UE6 | yes | no |  |  |  | 104 | 134 | UNKNOWN | approved: U-series -> UNKNOWN |
| L26 | yes | yes | 14" T.V. | 6 | 5 | 104 | 130 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA11 | yes | no |  |  |  | 104 | 124 | UNKNOWN | approved: U-series -> UNKNOWN |
| BW31 | yes | yes | MISC | 5 | -9 | 103 | 143 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BL51 | yes | yes | MISC. | 9 | -9 | 103 | 135 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE73 | yes | yes | STUFF | 9 | -9 | 103 | 133 | BE73 | already in current seed |
| BA81 | yes | yes | JACKET | 20 | -8 | 103 | 132 | BA81 | already in current seed |
| AK23 | yes | yes | LARGE TV | 6 | -3 | 103 | 121 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'Q | yes | yes | RINGS | 100 | 1 | 103 | 116 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| FA33 | yes | yes | STEREO | 10 | -9 | 102 | 142 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD64 | yes | yes | BIG STUFF | 20 | -8 | 102 | 139 | BD64 | already in current seed |
| BN41 | yes | yes | MISC | 10 | -21 | 102 | 135 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB24 | yes | yes | FISHING TRAC | 20 | -9 | 102 | 134 | BB24 | already in current seed |
| M1 | yes | yes | 14" T.V. | 7 | 4 | 102 | 129 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA63 | yes | yes | JACKET | 20 | -18 | 102 | 126 | BA63 | already in current seed |
| BW21 | yes | yes | MISC | 5 | -11 | 102 | 123 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L35 | yes | yes | 20" T.V. | 4 | 4 | 102 | 121 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U3 | yes | no |  |  |  | 102 | 118 | UNKNOWN | approved: U-series -> UNKNOWN |
| UF10 | yes | no |  |  |  | 101 | 160 | UNKNOWN | approved: U-series -> UNKNOWN |
| FU7 | yes | yes | Furniture 2 | 10 | -32 | 101 | 157 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA73 | yes | yes | JACKET | 20 | -10 | 101 | 139 | BA73 | already in current seed |
| DS1 | yes | yes | DECK & AMP | 10 | 12 | 101 | 125 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB12 | yes | no |  |  |  | 101 | 114 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB15 | yes | no |  |  |  | 101 | 112 | UNKNOWN | approved: U-series -> UNKNOWN |
| UF14 | yes | no |  |  |  | 100 | 144 | UNKNOWN | approved: U-series -> UNKNOWN |
| AG96 | yes | yes | OTHER | 20 | -16 | 100 | 139 | AG96 | already in current seed |
| BW72 | yes | yes | MISC | 5 | -11 | 100 | 122 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BE83 | yes | yes | STUFF | 9 | -13 | 100 | 120 | BE83 | already in current seed |
| U5 | yes | no |  |  |  | 100 | 120 | UNKNOWN | approved: U-series -> UNKNOWN |
| L7 | yes | yes | 14" T.V. | 6 | 3 | 100 | 119 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM28 | yes | yes | GUITAR AMP | 5 | 13 | 100 | 118 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB32 | yes | no |  |  |  | 100 | 118 | UNKNOWN | approved: U-series -> UNKNOWN |
| AB77 | yes | yes | VCRS | 10 | -2 | 100 | 117 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA13 | yes | no |  |  |  | 100 | 109 | UNKNOWN | approved: U-series -> UNKNOWN |
| FU9 | yes | yes | Furniture 2 | 10 | -29 | 99 | 151 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BW51 | yes | yes | MISC | 5 | -16 | 99 | 136 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BV12 | yes | yes | MISC. | 5 | -16 | 99 | 132 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UF5 | yes | no |  |  |  | 99 | 132 | UNKNOWN | approved: U-series -> UNKNOWN |
| BL62 | yes | yes | MISC. | 9 | -12 | 99 | 128 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA4 | yes | no |  |  |  | 99 | 122 | UNKNOWN | approved: U-series -> UNKNOWN |
| UA24 | yes | no |  |  |  | 99 | 106 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG10 | yes | no |  |  |  | 98 | 138 | UNKNOWN | approved: U-series -> UNKNOWN |
| BW22 | yes | yes | MISC | 5 | -9 | 98 | 125 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA5 | yes | no |  |  |  | 98 | 125 | UNKNOWN | approved: U-series -> UNKNOWN |
| DA12 | yes | yes | BIG STEREO | 5 | 11 | 98 | 120 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ1 | yes | no |  |  |  | 98 | 120 | UNKNOWN | approved: U-series -> UNKNOWN |
| L30 | yes | yes | 14" T.V. | 6 | 8 | 98 | 117 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M11 | yes | yes | 20" T.V. | 4 | 0 | 98 | 117 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AK22 | yes | yes | LARGE TV | 6 | -2 | 98 | 115 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BP13 | yes | yes | GUITAR | 0 | -18 | 98 | 113 | BP13 | already in current seed |
| BE13 | yes | yes | GUITAR | 6 | -11 | 97 | 135 | BE13 | already in current seed |
| BD34 | yes | yes | BIG STUFF | 20 | -10 | 97 | 133 | BD34 | already in current seed |
| BW73 | yes | yes | MISC | 5 | -12 | 97 | 131 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DS3 | yes | yes | MID STEREO S | 3 | 5 | 97 | 120 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M5 | yes | yes | 14" T.V. | 5 | 7 | 97 | 110 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB11 | yes | no |  |  |  | 97 | 104 | UNKNOWN | approved: U-series -> UNKNOWN |
| HA42 | yes | yes | BIG ITEMS | 9 | -14 | 96 | 147 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AA97 | yes | yes | BIG SPEAKERS | 4 | -5 | 96 | 139 | AA97 | already in current seed |
| BG61 | yes | yes | STUFF | 9 | -3 | 96 | 133 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC83 | yes | yes | BIG STUFF | 20 | -11 | 96 | 130 | BC83 | already in current seed |
| BG21 | yes | yes | STUFF | 9 | -13 | 96 | 129 | BG21 | already in current seed |
| F 3 | yes | yes | FURNITURE | 30 | 3 | 96 | 129 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U13 | yes | no |  |  |  | 96 | 122 | UNKNOWN | approved: U-series -> UNKNOWN |
| BA84 | yes | yes | JACKET | 20 | -13 | 96 | 121 | BA84 | already in current seed |
| BD83 | yes | yes | MISC. | 10 | -7 | 96 | 121 | BD83 | already in current seed |
| FU6 | yes | yes | Furniture 2 | 10 | -21 | 95 | 147 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF73 | yes | yes | STUFF | 9 | -9 | 95 | 126 | BF73 | already in current seed |
| BS22 | yes | yes | MISC. | 10 | -5 | 95 | 121 | BS22 | already in current seed |
| U37 | yes | no |  |  |  | 95 | 115 | UNKNOWN | approved: U-series -> UNKNOWN |
| BV24 | yes | yes | MISC. | 5 | -9 | 95 | 113 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M9 | yes | yes | 14" T.V. | 6 | 6 | 95 | 112 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB31 | yes | no |  |  |  | 95 | 110 | UNKNOWN | approved: U-series -> UNKNOWN |
| BD44 | yes | yes | BIG STUFF | 20 | -4 | 94 | 130 | BD44 | already in current seed |
| BA25 | yes | yes | JACKET | 20 | -6 | 94 | 129 | BA25 | already in current seed |
| L36 | yes | yes | 20" T.V. | 4 | 3 | 94 | 119 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DS13 | yes | yes | SPEAKER ONLY | 6 | 17 | 94 | 111 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UG3 | yes | no |  |  |  | 93 | 127 | UNKNOWN | approved: U-series -> UNKNOWN |
| BA64 | yes | yes | JACKET | 20 | -6 | 93 | 120 | BA64 | already in current seed |
| AB87 | yes | yes | VCRS | 10 | -1 | 93 | 118 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BM52 | yes | yes | MISC | 10 | -9 | 93 | 118 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U17 | yes | no |  |  |  | 93 | 118 | UNKNOWN | approved: U-series -> UNKNOWN |
| BW12 | yes | yes | MISC | 5 | -8 | 93 | 117 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC81 | yes | yes | BIG STUFF | 20 | -14 | 93 | 114 | BC81 | already in current seed |
| BX52 | yes | yes | MISC | 5 | -6 | 93 | 112 | BX52 | already in current seed |
| UA25 | yes | no |  |  |  | 93 | 97 | UNKNOWN | approved: U-series -> UNKNOWN |
| BIWK | yes | yes | BIWK | 20 | -73 | 92 | 17843 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T13 | yes | yes | TOOL BOX | 20 | 5 | 92 | 147 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UF12 | yes | no |  |  |  | 92 | 138 | UNKNOWN | approved: U-series -> UNKNOWN |
| BV44 | yes | yes | MISC. | 5 | -6 | 92 | 114 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB39 | yes | no |  |  |  | 92 | 112 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB17 | yes | no |  |  |  | 92 | 104 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB19 | yes | no |  |  |  | 92 | 104 | UNKNOWN | approved: U-series -> UNKNOWN |
| STOP | yes | yes | NINTENDO BOX | 20 | 17 | 92 | 103 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA23 | yes | no |  |  |  | 92 | 101 | UNKNOWN | approved: U-series -> UNKNOWN |
| UA10 | yes | no |  |  |  | 91 | 131 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG5 | yes | no |  |  |  | 91 | 130 | UNKNOWN | approved: U-series -> UNKNOWN |
| BP32 | yes | yes | VACUUM CLEAN | 6 | -4 | 91 | 116 | BP32 | already in current seed |
| UL1 | yes | no |  |  |  | 91 | 116 | UNKNOWN | approved: U-series -> UNKNOWN |
| UA19 | yes | no |  |  |  | 91 | 104 | UNKNOWN | approved: U-series -> UNKNOWN |
| UF3 | yes | no |  |  |  | 90 | 142 | UNKNOWN | approved: U-series -> UNKNOWN |
| T2 | yes | yes | TOOL BOX | 20 | 1 | 90 | 132 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UE4 | yes | no |  |  |  | 90 | 129 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG12 | yes | no |  |  |  | 90 | 128 | UNKNOWN | approved: U-series -> UNKNOWN |
| BW43 | yes | yes | MISC | 5 | -15 | 90 | 114 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TC8 | yes | yes | GHETTO BLAST | 15 | 19 | 90 | 94 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UF13 | yes | no |  |  |  | 89 | 145 | UNKNOWN | approved: U-series -> UNKNOWN |
| R12 | yes | yes | TOOLS | 5 | 4 | 89 | 139 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA54 | yes | yes | JACKET | 20 | -9 | 89 | 123 | BA54 | already in current seed |
| BC54 | yes | yes | BIG STUFF | 20 | -10 | 89 | 117 | BC54 | already in current seed |
| AD94 | yes | yes | 14" TV | 3 | -9 | 89 | 116 | AD94 | already in current seed |
| L16 | yes | yes | 20" T.V. | 3 | 3 | 89 | 113 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE42 | yes | yes | 20" TV | 3 | 0 | 89 | 112 | AE42 | already in current seed |
| U23 | yes | no |  |  |  | 89 | 107 | UNKNOWN | approved: U-series -> UNKNOWN |
| U6 | yes | no |  |  |  | 89 | 107 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB6 | yes | no |  |  |  | 89 | 107 | UNKNOWN | approved: U-series -> UNKNOWN |
| UD10 | yes | no |  |  |  | 89 | 103 | UNKNOWN | approved: U-series -> UNKNOWN |
| UA16 | yes | no |  |  |  | 89 | 102 | UNKNOWN | approved: U-series -> UNKNOWN |
| UA18 | yes | no |  |  |  | 89 | 100 | UNKNOWN | approved: U-series -> UNKNOWN |
| FU8 | yes | yes | Furniture 2 | 10 | -8 | 88 | 133 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DG1 | yes | yes | GOLF CLUB | 20 | 10 | 88 | 125 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB9 | yes | no |  |  |  | 88 | 113 | UNKNOWN | approved: U-series -> UNKNOWN |
| BC82 | yes | yes | BIG STUFF | 20 | -8 | 88 | 112 | BC82 | already in current seed |
| U18 | yes | no |  |  |  | 88 | 112 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB14 | yes | no |  |  |  | 88 | 93 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB24 | yes | no |  |  |  | 88 | 93 | UNKNOWN | approved: U-series -> UNKNOWN |
| BL41 | yes | yes | MISC. | 9 | -10 | 87 | 120 | BL41 | already in current seed |
| BB54 | yes | yes | JACKET | 20 | -12 | 87 | 117 | BB54 | already in current seed |
| BB62 | yes | yes | JACKET | 20 | -11 | 87 | 113 | BB62 | already in current seed |
| TD3 | yes | yes | GHETTO | 5 | 5 | 87 | 110 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AE92 | yes | yes | 20" TV | 3 | -6 | 87 | 108 | AE92 | already in current seed |
| L43 | yes | yes | 26" T.V. | 4 | -2 | 87 | 107 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AK62 | yes | yes | TV | 0 | -16 | 87 | 104 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L37 | yes | yes | 20" T.V. | 4 | 2 | 87 | 92 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB44 | yes | yes | JACKET | 20 | -7 | 86 | 122 | BB44 | already in current seed |
| BP42 | yes | yes | VACUUM CLEAN | 6 | -13 | 86 | 116 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD84 | yes | yes | 14' TV | 3 | 1 | 86 | 113 | AD84 | already in current seed |
| AK53 | yes | yes | TV | 9 | -8 | 86 | 113 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UE13 | yes | no |  |  |  | 86 | 109 | UNKNOWN | approved: U-series -> UNKNOWN |
| BK72 | yes | yes | GUITAR | 9 | -4 | 86 | 108 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U16 | yes | no |  |  |  | 86 | 106 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB30 | yes | no |  |  |  | 86 | 96 | UNKNOWN | approved: U-series -> UNKNOWN |
| UA20 | yes | no |  |  |  | 86 | 94 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG11 | yes | no |  |  |  | 85 | 125 | UNKNOWN | approved: U-series -> UNKNOWN |
| BB13 | yes | yes | JACKET | 20 | -11 | 85 | 122 | BB13 | already in current seed |
| BX32 | yes | yes | MISC | 5 | -12 | 85 | 114 | BX32 | already in current seed |
| U21 | yes | no |  |  |  | 85 | 109 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB37 | yes | no |  |  |  | 85 | 105 | UNKNOWN | approved: U-series -> UNKNOWN |
| HA33 | yes | yes | BIG ITEMS | 9 | -8 | 84 | 116 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BL22 | yes | yes | GUITAR | 9 | -5 | 84 | 115 | BL22 | already in current seed |
| BA82 | yes | yes | JACKET | 20 | -4 | 84 | 113 | BA82 | already in current seed |
| BR32 | yes | yes | MISC. | 10 | -6 | 84 | 111 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U31 | yes | no |  |  |  | 84 | 104 | UNKNOWN | approved: U-series -> UNKNOWN |
| BW23 | yes | yes | MISC | 5 | -13 | 84 | 103 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB20 | yes | no |  |  |  | 84 | 95 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB28 | yes | no |  |  |  | 84 | 94 | UNKNOWN | approved: U-series -> UNKNOWN |
| GA33 | yes | yes | MICROWAVE | 10 | -17 | 83 | 121 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA15 | yes | yes | JACKET | 20 | -14 | 83 | 120 | BA15 | already in current seed |
| BF71 | yes | yes | STUFF | 9 | -10 | 83 | 120 | BF71 | already in current seed |
| R13 | yes | yes | TOOLS | 5 | 7 | 83 | 119 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UE8 | yes | no |  |  |  | 83 | 112 | UNKNOWN | approved: U-series -> UNKNOWN |
| U24 | yes | no |  |  |  | 83 | 101 | UNKNOWN | approved: U-series -> UNKNOWN |
| BU22 | yes | yes | MISC. | 5 | -3 | 83 | 98 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BW33 | yes | yes | MISC | 5 | -4 | 83 | 97 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD12 | yes | no |  |  |  | 83 | 95 | UNKNOWN | approved: U-series -> UNKNOWN |
| L33 | yes | yes | 20" T.V. | 4 | 3 | 83 | 94 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BG12 | yes | yes | STUFF | 9 | -9 | 82 | 120 | BG12 | already in current seed |
| BL63 | yes | yes | MISC. | 9 | -6 | 82 | 118 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BN61 | yes | yes | MISC | 10 | -2 | 82 | 113 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U22 | yes | no |  |  |  | 82 | 105 | UNKNOWN | approved: U-series -> UNKNOWN |
| AK52 | yes | yes | TV | 9 | -16 | 82 | 104 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM17 | yes | yes | MICROWAVE | 5 | 3 | 82 | 93 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA22 | yes | no |  |  |  | 82 | 93 | UNKNOWN | approved: U-series -> UNKNOWN |
| R15 | yes | yes | TOOLS | 5 | -3 | 81 | 133 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UF1 | yes | no |  |  |  | 81 | 120 | UNKNOWN | approved: U-series -> UNKNOWN |
| BW62 | yes | yes | MISC | 5 | -10 | 81 | 108 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L3 | yes | yes | 20" T.V. | 5 | 0 | 81 | 100 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U32 | yes | no |  |  |  | 81 | 100 | UNKNOWN | approved: U-series -> UNKNOWN |
| BA94 | yes | yes | JACKET | 20 | -7 | 81 | 99 | BA94 | already in current seed |
| R'O | yes | yes | RINGS | 100 | 5 | 80 | 117 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UE12 | yes | no |  |  |  | 80 | 115 | UNKNOWN | approved: U-series -> UNKNOWN |
| HA23 | yes | yes | BIG ITEMS | 9 | -10 | 80 | 114 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UF7 | yes | no |  |  |  | 80 | 113 | UNKNOWN | approved: U-series -> UNKNOWN |
| DD7 | yes | yes | AMP,DECK | 6 | 4 | 80 | 108 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U20 | yes | no |  |  |  | 80 | 99 | UNKNOWN | approved: U-series -> UNKNOWN |
| U4 | yes | no |  |  |  | 80 | 98 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK1 | yes | no |  |  |  | 80 | 96 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG2 | yes | no |  |  |  | 79 | 114 | UNKNOWN | approved: U-series -> UNKNOWN |
| UE5 | yes | no |  |  |  | 79 | 109 | UNKNOWN | approved: U-series -> UNKNOWN |
| AE82 | yes | yes | 20" TV | 3 | 0 | 79 | 107 | AE82 | already in current seed |
| AE62 | yes | yes | 20" TV | 3 | -3 | 79 | 101 | AE62 | already in current seed |
| UK11 | yes | no |  |  |  | 79 | 83 | UNKNOWN | approved: U-series -> UNKNOWN |
| AA87 | yes | yes | OTHER | 0 | -10 | 78 | 119 | AA87 | already in current seed |
| UG15 | yes | no |  |  |  | 78 | 114 | UNKNOWN | approved: U-series -> UNKNOWN |
| DD6 | yes | yes | AMP,DECK | 6 | 3 | 78 | 108 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L40 | yes | yes | 28" T.V. | 8 | 2 | 78 | 101 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AD74 | yes | yes | 14" TV | 3 | -13 | 78 | 100 | AD74 | already in current seed |
| UL5 | yes | no |  |  |  | 78 | 97 | UNKNOWN | approved: U-series -> UNKNOWN |
| H | yes | no |  |  |  | 77 | 202 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA35 | yes | yes | JACKET | 20 | -8 | 77 | 113 | BA35 | already in current seed |
| BA72 | yes | yes | JACKET | 20 | -7 | 77 | 110 | BA72 | already in current seed |
| UE10 | yes | no |  |  |  | 77 | 110 | UNKNOWN | approved: U-series -> UNKNOWN |
| BF83 | yes | yes | STUFF | 9 | -3 | 77 | 108 | BF83 | already in current seed |
| BW52 | yes | yes | MISC | 5 | -6 | 77 | 106 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DV15 | yes | yes | GUITAR AMP | 4 | 3 | 77 | 103 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U33 | yes | no |  |  |  | 77 | 99 | UNKNOWN | approved: U-series -> UNKNOWN |
| BR22 | yes | yes | MISC. | 10 | -11 | 77 | 98 | BR22 | already in current seed |
| UA6 | yes | no |  |  |  | 77 | 97 | UNKNOWN | approved: U-series -> UNKNOWN |
| L34 | yes | yes | 14" T.V. | 3 | 3 | 77 | 93 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DA9 | yes | yes | HIGH CHAIR | 10 | 6 | 77 | 90 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA21 | yes | no |  |  |  | 77 | 87 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB38 | yes | no |  |  |  | 77 | 85 | UNKNOWN | approved: U-series -> UNKNOWN |
| BC84 | yes | yes | BIG STUFF | 20 | -14 | 76 | 105 | BC84 | already in current seed |
| DV11 | yes | yes | KEYBOARDS | 20 | 12 | 76 | 103 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UE15 | yes | no |  |  |  | 76 | 101 | UNKNOWN | approved: U-series -> UNKNOWN |
| BA93 | yes | yes | JACKET | 20 | -10 | 76 | 96 | BA93 | already in current seed |
| AE72 | yes | yes | 20" TV | 3 | -7 | 76 | 93 | AE72 | already in current seed |
| UA15 | yes | no |  |  |  | 76 | 85 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG1 | yes | no |  |  |  | 75 | 118 | UNKNOWN | approved: U-series -> UNKNOWN |
| UF6 | yes | no |  |  |  | 75 | 104 | UNKNOWN | approved: U-series -> UNKNOWN |
| HA43 | yes | yes | BIG ITEMS | 9 | -11 | 75 | 103 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD84 | yes | yes | OTHER | 0 | -4 | 75 | 98 | BD84 | already in current seed |
| L25 | yes | yes | 26" T.V. | 4 | 2 | 75 | 91 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| RR'U | yes | yes | OTHER | 20 | -10 | 75 | 90 | RR-U | format: RR apostrophe -> RR hyphen |
| UA2 | yes | no |  |  |  | 74 | 100 | UNKNOWN | approved: U-series -> UNKNOWN |
| R23 | yes | yes | TOOLS | 5 | 4 | 74 | 98 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U2 | yes | no |  |  |  | 74 | 97 | UNKNOWN | approved: U-series -> UNKNOWN |
| AG77 | yes | yes | OTHER | 20 | -5 | 74 | 88 | AG77 | already in current seed |
| UK10 | yes | no |  |  |  | 74 | 88 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB21 | yes | no |  |  |  | 74 | 85 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB23 | yes | no |  |  |  | 74 | 81 | UNKNOWN | approved: U-series -> UNKNOWN |
| L | yes | no |  |  |  | 73 | 149 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF82 | yes | yes | STUFF | 9 | -4 | 73 | 98 | BF82 | already in current seed |
| DD3 | yes | yes | AMP,DECK | 6 | 6 | 73 | 98 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM11 | yes | yes | MICROWAVE | 5 | 2 | 73 | 94 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM12 | yes | yes | MICROWAVE | 5 | 3 | 73 | 93 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB16 | yes | no |  |  |  | 73 | 84 | UNKNOWN | approved: U-series -> UNKNOWN |
| N4 | yes | yes | TOOLS | 4 | 11 | 72 | 103 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U25 | yes | no |  |  |  | 72 | 99 | UNKNOWN | approved: U-series -> UNKNOWN |
| U30 | yes | no |  |  |  | 72 | 98 | UNKNOWN | approved: U-series -> UNKNOWN |
| AK12 | yes | yes | LARGE TV | 6 | -1 | 72 | 93 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U7 | yes | no |  |  |  | 72 | 91 | UNKNOWN | approved: U-series -> UNKNOWN |
| U8 | yes | no |  |  |  | 72 | 85 | UNKNOWN | approved: U-series -> UNKNOWN |
| BP22 | yes | yes | VACUUM CLEAN | 6 | -5 | 71 | 100 | BP22 | already in current seed |
| FU4 | yes | yes | Furniture 2 | 10 | -13 | 71 | 100 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BR12 | yes | yes | MISC. | 10 | -5 | 71 | 97 | BR12 | already in current seed |
| RR'Z | yes | yes | OTHER | 20 | -9 | 71 | 91 | RR-Z | format: RR apostrophe -> RR hyphen |
| U27 | yes | no |  |  |  | 71 | 88 | UNKNOWN | approved: U-series -> UNKNOWN |
| UF4 | yes | no |  |  |  | 70 | 108 | UNKNOWN | approved: U-series -> UNKNOWN |
| UF8 | yes | no |  |  |  | 70 | 96 | UNKNOWN | approved: U-series -> UNKNOWN |
| DV9 | yes | yes | GUITAR N CAS | 10 | 17 | 70 | 87 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB34 | yes | no |  |  |  | 70 | 81 | UNKNOWN | approved: U-series -> UNKNOWN |
| UH1 | yes | no |  |  |  | 70 | 81 | UNKNOWN | approved: U-series -> UNKNOWN |
| UF15 | yes | no |  |  |  | 69 | 117 | UNKNOWN | approved: U-series -> UNKNOWN |
| UE14 | yes | no |  |  |  | 69 | 99 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG6 | yes | no |  |  |  | 69 | 98 | UNKNOWN | approved: U-series -> UNKNOWN |
| BX12 | yes | yes | MISC | 5 | -8 | 69 | 88 | BX12 | already in current seed |
| BX22 | yes | yes | MISC | 5 | -5 | 69 | 88 | BX22 | already in current seed |
| BS12 | yes | yes | MISC. | 10 | 0 | 69 | 82 | BS12 | already in current seed |
| UB35 | yes | no |  |  |  | 69 | 81 | UNKNOWN | approved: U-series -> UNKNOWN |
| BW81 | yes | yes | MISC | 5 | -4 | 68 | 88 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BD74 | yes | yes | BIG STUFF | 20 | -7 | 68 | 85 | BD74 | already in current seed |
| DM15 | yes | yes | MICROWAVE | 5 | 2 | 68 | 80 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM6 | yes | yes | MICROWAVE | 5 | 3 | 68 | 77 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB25 | yes | no |  |  |  | 68 | 76 | UNKNOWN | approved: U-series -> UNKNOWN |
| R19 | yes | yes | TOOLS | 5 | 5 | 67 | 98 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UA8 | yes | no |  |  |  | 67 | 90 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG9 | yes | no |  |  |  | 67 | 86 | UNKNOWN | approved: U-series -> UNKNOWN |
| UD14 | yes | no |  |  |  | 67 | 82 | UNKNOWN | approved: U-series -> UNKNOWN |
| UD16 | yes | no |  |  |  | 67 | 79 | UNKNOWN | approved: U-series -> UNKNOWN |
| UL6 | yes | no |  |  |  | 67 | 78 | UNKNOWN | approved: U-series -> UNKNOWN |
| R16 | yes | yes | TOOLS | 5 | 6 | 66 | 112 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DV14 | yes | yes | GUITAR AMP | 4 | 5 | 66 | 93 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DS2 | yes | yes | DECK & AMP | 10 | 11 | 66 | 91 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DC1 | yes | yes | SM STEREO | 5 | 10 | 66 | 86 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BB15 | yes | yes | JACKET | 20 | -6 | 66 | 85 | BB15 | already in current seed |
| BB63 | yes | yes | JACKET | 20 | -8 | 66 | 78 | BB63 | already in current seed |
| DM16 | yes | yes | MICROWAVE | 5 | 1 | 66 | 77 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG86 | yes | yes | OTHER | 20 | -3 | 65 | 98 | AG86 | already in current seed |
| M12 | yes | yes | 33" T.V. | 4 | 2 | 65 | 79 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DV12 | yes | yes | KEYBOARD | 15 | 4 | 64 | 85 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ11 | yes | no |  |  |  | 64 | 77 | UNKNOWN | approved: U-series -> UNKNOWN |
| DB9 | yes | yes | FURNITURE | 9 | 5 | 64 | 75 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BW32 | yes | yes | MISC | 5 | -7 | 63 | 90 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BW71 | yes | yes | MISC | 5 | -4 | 63 | 87 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BX62 | yes | yes | MISC | 5 | -6 | 62 | 80 | BX62 | already in current seed |
| BT52 | yes | yes | MISC. | 10 | -7 | 62 | 78 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DS6 | yes | yes | MID STEREO S | 4 | 6 | 62 | 77 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BP72 | yes | yes | VACUUM CLEAN | 6 | -7 | 62 | 72 | BP72 | already in current seed |
| M15 | yes | yes | 20" T.V. | 4 | 18 | 62 | 71 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UF9 | yes | no |  |  |  | 61 | 88 | UNKNOWN | approved: U-series -> UNKNOWN |
| BB25 | yes | yes | JACKET | 20 | -7 | 61 | 81 | BB25 | already in current seed |
| UA9 | yes | no |  |  |  | 61 | 79 | UNKNOWN | approved: U-series -> UNKNOWN |
| BP52 | yes | yes | VACUUM CLEAN | 6 | -1 | 61 | 75 | BP52 | already in current seed |
| UA14 | yes | no |  |  |  | 61 | 69 | UNKNOWN | approved: U-series -> UNKNOWN |
| AC38 | yes | yes | OTHER | 20 | 0 | 61 | 67 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UE7 | yes | no |  |  |  | 60 | 92 | UNKNOWN | approved: U-series -> UNKNOWN |
| N3 | yes | yes | TOOLS | 4 | 7 | 60 | 90 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BW53 | yes | yes | MISC | 5 | -10 | 60 | 88 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'Y | yes | yes | RINGS | 100 | 3 | 60 | 88 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UL3 | yes | no |  |  |  | 60 | 76 | UNKNOWN | approved: U-series -> UNKNOWN |
| DD8 | yes | yes | AMP,DECK | 6 | 6 | 59 | 83 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'I | yes | yes | RINGS | 100 | 0 | 59 | 83 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BW83 | yes | yes | MISC | 5 | -10 | 59 | 80 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG87 | yes | yes | OTHER | 20 | -10 | 59 | 74 | AG87 | already in current seed |
| DM5 | yes | yes | MICROWAVE | 5 | 5 | 59 | 71 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UK17 | yes | yes | TYPEWRITER | 6 | 6 | 59 | 68 | UNKNOWN | approved: U-series -> UNKNOWN |
| BL32 | yes | yes | MISC. | 9 | -2 | 59 | 67 | BL32 | already in current seed |
| DM25 | yes | yes | MICROWAVE | 5 | 4 | 59 | 67 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB18 | yes | no |  |  |  | 59 | 67 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK14 | yes | yes | TYPEWRITER | 6 | 5 | 59 | 67 | UNKNOWN | approved: U-series -> UNKNOWN |
| T | yes | yes | TOOL BOX | 150 | 0 | 58 | 103 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UG4 | yes | no |  |  |  | 58 | 91 | UNKNOWN | approved: U-series -> UNKNOWN |
| BB65 | yes | yes | JACKET | 20 | -12 | 58 | 85 | BB65 | already in current seed |
| UG7 | yes | no |  |  |  | 58 | 81 | UNKNOWN | approved: U-series -> UNKNOWN |
| DV7 | yes | yes | GUITARS | 10 | 2 | 58 | 79 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA92 | yes | yes | JACKET | 20 | -5 | 58 | 77 | BA92 | already in current seed |
| UJ10 | yes | no |  |  |  | 58 | 72 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK12 | yes | no |  |  |  | 58 | 66 | UNKNOWN | approved: U-series -> UNKNOWN |
| UB7 | yes | no |  |  |  | 57 | 83 | UNKNOWN | approved: U-series -> UNKNOWN |
| BV34 | yes | yes | MISC. | 5 | -7 | 57 | 78 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF62 | yes | no |  |  |  | 57 | 74 | BF62 | already in current seed |
| DM20 | yes | yes | MICROWAVE | 5 | -1 | 57 | 74 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BQ12 | yes | yes | BABY ITEMS | 6 | -1 | 57 | 71 | BQ12 | already in current seed |
| S9 | yes | yes | NINTENDO BOX | 5 | 6 | 57 | 69 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK33 | yes | yes | VACCUM | 0 | -5 | 57 | 65 | BK33 | already in current seed |
| DM14 | yes | yes | MICROWAVE | 5 | 2 | 57 | 65 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| B | yes | no |  |  |  | 57 | 59 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DD1 | yes | yes | AMP, DECK | 6 | 4 | 56 | 95 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R24 | yes | yes | TOOLS | 5 | 3 | 56 | 88 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L18 | yes | yes | 20" T.V. | 3 | 3 | 56 | 71 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM8 | yes | yes | MICROWAVE | 5 | 2 | 56 | 66 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N1 | yes | yes | TOOLS | 4 | 6 | 55 | 79 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UE9 | yes | no |  |  |  | 55 | 74 | UNKNOWN | approved: U-series -> UNKNOWN |
| UD15 | yes | no |  |  |  | 55 | 67 | UNKNOWN | approved: U-series -> UNKNOWN |
| BP82 | yes | yes | VACUUM CLEAN | 6 | -2 | 55 | 64 | BP82 | already in current seed |
| M16 | yes | yes | 33" T.V. | 4 | 21 | 55 | 63 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UB40 | yes | no |  |  |  | 55 | 62 | UNKNOWN | approved: U-series -> UNKNOWN |
| BW63 | yes | yes | MISC | 5 | -8 | 54 | 81 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BW82 | yes | yes | MISC | 5 | -3 | 54 | 75 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BP62 | yes | yes | VACUUM CLEAN | 6 | -6 | 54 | 73 | BP62 | already in current seed |
| UD13 | yes | no |  |  |  | 54 | 67 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG8 | yes | no |  |  |  | 53 | 82 | UNKNOWN | approved: U-series -> UNKNOWN |
| UE11 | yes | no |  |  |  | 53 | 81 | UNKNOWN | approved: U-series -> UNKNOWN |
| BW42 | yes | yes | MISC | 5 | -4 | 53 | 75 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DD5 | yes | yes | AMP,DECK | 6 | 6 | 53 | 72 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AG97 | yes | yes | OTHER | 20 | -1 | 53 | 71 | AG97 | already in current seed |
| BV21 | yes | yes | MISC. | 5 | 0 | 53 | 66 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM18 | yes | yes | MICROWAVE | 5 | 2 | 53 | 66 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD19 | yes | no |  |  |  | 53 | 63 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK6 | yes | no |  |  |  | 53 | 62 | UNKNOWN | approved: U-series -> UNKNOWN |
| AX21 | yes | yes | TOOLS | 20 | 28 | 52 | 82 | AX21 | already in current seed |
| AX31 | yes | yes | TOOLS | 20 | 25 | 52 | 79 | AX31 | already in current seed |
| R2 | yes | yes | TOOLS | 5 | 4 | 52 | 79 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA91 | yes | yes | JACKET | 20 | -6 | 52 | 73 | BA91 | already in current seed |
| DM10 | yes | yes | MICROWAVE | 5 | 2 | 52 | 68 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ13 | yes | no |  |  |  | 52 | 60 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK2 | yes | no |  |  |  | 52 | 60 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK3 | yes | no |  |  |  | 52 | 59 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK7 | yes | no |  |  |  | 52 | 57 | UNKNOWN | approved: U-series -> UNKNOWN |
| AX61 | yes | yes | TOOLS | 20 | 27 | 51 | 78 | AX61 | already in current seed |
| BQ62 | yes | yes | BABY ITEMS | 6 | -5 | 51 | 66 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DB12 | yes | yes | FURNITURE | 5 | 11 | 51 | 63 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BR52 | yes | yes | MISC. | 10 | -5 | 51 | 60 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UK5 | yes | no |  |  |  | 51 | 54 | UNKNOWN | approved: U-series -> UNKNOWN |
| DD2 | yes | yes | AMP,DECK | 6 | 4 | 50 | 77 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R21 | yes | yes | TOOLS | 5 | 3 | 50 | 74 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DD4 | yes | yes | AMP,DECK | 6 | 4 | 50 | 73 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK92 | yes | yes | GUITAR | 9 | -2 | 50 | 69 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DA2 | yes | yes | FURNITURE | 4 | 0 | 50 | 58 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TC5 | yes | yes | GHETTO BLAST | 15 | 11 | 50 | 54 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N2 | yes | yes | TOOLS | 4 | 9 | 49 | 73 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA74 | yes | yes | JACKET | 20 | -5 | 49 | 69 | BA74 | already in current seed |
| BB64 | yes | yes | JACKET | 20 | -8 | 49 | 62 | BB64 | already in current seed |
| U28 | yes | no |  |  |  | 49 | 61 | UNKNOWN | approved: U-series -> UNKNOWN |
| UL4 | yes | no |  |  |  | 49 | 60 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK18 | yes | yes | TYPEWRITER | 6 | 5 | 49 | 54 | UNKNOWN | approved: U-series -> UNKNOWN |
| N5 | yes | yes | TOOLS | 4 | 8 | 48 | 72 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N10 | yes | yes | TOOLS | 4 | 3 | 48 | 70 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM22 | yes | yes | MICROWAVE | 5 | 2 | 48 | 60 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DB2 | yes | yes | FURNITURE | 5 | 6 | 48 | 58 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DA8 | yes | yes | FURNITURE | 4 | 3 | 48 | 57 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ17 | yes | no |  |  |  | 48 | 54 | UNKNOWN | approved: U-series -> UNKNOWN |
| UG14 | yes | no |  |  |  | 47 | 82 | UNKNOWN | approved: U-series -> UNKNOWN |
| BA85 | yes | yes | JACKET | 20 | -5 | 47 | 69 | BA85 | already in current seed |
| BR62 | yes | yes | MISC. | 10 | -5 | 47 | 66 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DB1 | yes | yes | FURNITURE | 5 | 6 | 47 | 60 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD11 | yes | no |  |  |  | 47 | 60 | UNKNOWN | approved: U-series -> UNKNOWN |
| UJ12 | yes | no |  |  |  | 47 | 54 | UNKNOWN | approved: U-series -> UNKNOWN |
| AX11 | yes | yes | Tools | 20 | 20 | 46 | 84 | AX11 | already in current seed |
| AX41 | yes | yes | TOOLS | 20 | 19 | 46 | 77 | AX41 | already in current seed |
| U36 | yes | no |  |  |  | 46 | 70 | UNKNOWN | approved: U-series -> UNKNOWN |
| BS32 | yes | yes | MISC. | 10 | -3 | 46 | 56 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD5 | yes | no |  |  |  | 46 | 55 | UNKNOWN | approved: U-series -> UNKNOWN |
| UJ15 | yes | no |  |  |  | 46 | 54 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK4 | yes | no |  |  |  | 46 | 53 | UNKNOWN | approved: U-series -> UNKNOWN |
| DM23 | yes | yes | MICROWAVE | 5 | 5 | 46 | 52 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R25 | yes | yes | TOOLS | 5 | 4 | 45 | 68 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BA95 | yes | yes | JACKET | 20 | -7 | 45 | 65 | BA95 | already in current seed |
| BB55 | yes | yes | JACKET | 20 | -5 | 45 | 65 | BB55 | already in current seed |
| BT42 | yes | yes | MISC. | 10 | -3 | 45 | 59 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ14 | yes | no |  |  |  | 45 | 57 | UNKNOWN | approved: U-series -> UNKNOWN |
| R18 | yes | yes | TOOLS | 5 | 5 | 44 | 76 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UE1 | yes | no |  |  |  | 44 | 71 | UNKNOWN | approved: U-series -> UNKNOWN |
| BT12 | yes | yes | MISC. | 10 | -5 | 44 | 61 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD17 | yes | no |  |  |  | 44 | 55 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK15 | yes | yes | TYPEWRITER | 6 | 7 | 44 | 53 | UNKNOWN | approved: U-series -> UNKNOWN |
| R26 | yes | yes | TOOLS | 5 | 7 | 43 | 79 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX51 | yes | yes | TOOLS | 20 | 21 | 43 | 76 | AX51 | already in current seed |
| R6 | yes | yes | TOOLS | 5 | 6 | 43 | 75 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R1 | yes | yes | TOOLS | 5 | 2 | 43 | 66 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DD10 | yes | yes | AMP,DECK | 6 | 2 | 43 | 62 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DD9 | yes | yes | AMP,DECK | 6 | 4 | 43 | 60 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC28 | yes | yes | OTHER | 20 | 0 | 43 | 48 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK23 | yes | yes | VACCUM | 0 | -4 | 43 | 48 | BK23 | already in current seed |
| R5 | yes | yes | TOOLS | 5 | 4 | 42 | 70 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BS52 | yes | yes | MISC. | 10 | -3 | 42 | 55 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DB14 | yes | yes | FURNITURE | 5 | 8 | 42 | 48 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UK16 | yes | yes | TYPEWRITER | 6 | 6 | 42 | 48 | UNKNOWN | approved: U-series -> UNKNOWN |
| UE2 | yes | no |  |  |  | 41 | 75 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC5 | yes | no |  |  |  | 41 | 67 | UNKNOWN | approved: U-series -> UNKNOWN |
| N8 | yes | yes | TOOLS | 4 | 3 | 41 | 61 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BU12 | yes | yes | MISC. | 5 | -1 | 41 | 54 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BR42 | yes | yes | MISC. | 10 | -2 | 41 | 53 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DW2 | yes | yes | WEIGHT SET | 6 | 10 | 41 | 53 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R4 | yes | yes | TOOLS | 5 | 4 | 40 | 61 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UL2 | yes | no |  |  |  | 40 | 58 | UNKNOWN | approved: U-series -> UNKNOWN |
| R11 | yes | yes | TOOLS | 5 | 1 | 40 | 56 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD4 | yes | no |  |  |  | 40 | 49 | UNKNOWN | approved: U-series -> UNKNOWN |
| M13 | yes | yes | 14" T.V. | 5 | 1 | 40 | 43 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R10 | yes | yes | TOOLS | 5 | 3 | 39 | 64 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BQ52 | yes | yes | BABY ITEMS | 6 | -2 | 39 | 53 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DA10 | yes | yes | BIKE | 15 | 1 | 39 | 53 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N11 | yes | yes | TOOLS | 4 | 5 | 39 | 53 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ3 | yes | no |  |  |  | 39 | 47 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK19 | yes | yes | TYPEWRITER | 6 | 6 | 39 | 41 | UNKNOWN | approved: U-series -> UNKNOWN |
| BT22 | yes | yes | MISC. | 10 | -1 | 38 | 57 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DV16 | yes | yes | GUITAR AMP | 4 | 0 | 38 | 50 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD18 | yes | no |  |  |  | 38 | 49 | UNKNOWN | approved: U-series -> UNKNOWN |
| UJ16 | yes | no |  |  |  | 38 | 43 | UNKNOWN | approved: U-series -> UNKNOWN |
| R14 | yes | yes | TOOLS | 5 | 1 | 37 | 65 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK43 | yes | yes | VACCUM | 0 | -2 | 37 | 46 | BK43 | already in current seed |
| DA11 | yes | yes | BIG STEREO | 5 | 3 | 37 | 45 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BU32 | yes | yes | MISC. | 5 | -3 | 36 | 53 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TC6 | yes | yes | GHETTO BLAST | 15 | 15 | 36 | 46 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB98 | yes | yes | VCRS | 10 | -1 | 36 | 43 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TC7 | yes | yes | GHETTO BLAST | 15 | 7 | 36 | 38 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BS42 | yes | yes | MISC. | 10 | -4 | 35 | 49 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM26 | yes | yes | GUITAR AMP | 5 | 14 | 35 | 47 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R27 | yes | yes | TOOLS | 5 | 1 | 35 | 47 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DW3 | yes | yes | WEIGHT SET | 6 | 6 | 35 | 45 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM21 | yes | yes | MICROWAVE | 5 | 1 | 35 | 42 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UH3 | yes | no |  |  |  | 35 | 41 | UNKNOWN | approved: U-series -> UNKNOWN |
| M14 | yes | yes | 20" T.V. | 4 | 0 | 35 | 37 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R8 | yes | yes | TOOLS | 5 | 8 | 34 | 59 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N9 | yes | yes | TOOLS | 4 | 2 | 34 | 57 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BT32 | yes | yes | MISC. | 10 | -4 | 34 | 47 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DB5 | yes | yes | FURNITURE | 5 | 3 | 34 | 39 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BQ32 | yes | yes | BABY ITEMS | 6 | -2 | 33 | 49 | BQ32 | already in current seed |
| BQ72 | yes | no |  |  |  | 33 | 43 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM19 | yes | yes | MICROWAVE | 5 | 3 | 33 | 38 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N7 | yes | yes | TOOLS | 4 | 3 | 32 | 48 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R17 | yes | yes | TOOLS | 5 | 3 | 32 | 46 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BM13 | yes | yes | MISC | 0 | -11 | 32 | 43 | BM13 | already in current seed |
| DM13 | yes | yes | MICROWAVE | 5 | 1 | 32 | 42 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD8 | yes | no |  |  |  | 32 | 39 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC1 | yes | no |  |  |  | 31 | 64 | UNKNOWN | approved: U-series -> UNKNOWN |
| N6 | yes | yes | TOOLS | 4 | 9 | 31 | 52 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX71 | yes | yes | TOOLS | 20 | 20 | 31 | 49 | AX71 | already in current seed |
| UD20 | yes | no |  |  |  | 31 | 34 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK8 | yes | no |  |  |  | 31 | 33 | UNKNOWN | approved: U-series -> UNKNOWN |
| BS62 | yes | yes | MISC. | 10 | -3 | 30 | 47 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX13 | yes | yes | TOOLS | 20 | 20 | 30 | 41 | AX13 | already in current seed |
| UH2 | yes | no |  |  |  | 30 | 34 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK22 | yes | no |  |  |  | 30 | 31 | UNKNOWN | approved: U-series -> UNKNOWN |
| DV13 | yes | yes | GUITAR AMP | 4 | 2 | 29 | 46 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ2 | yes | no |  |  |  | 29 | 41 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC2 | yes | no |  |  |  | 29 | 40 | UNKNOWN | approved: U-series -> UNKNOWN |
| R22 | yes | yes | TOOLS | 5 | 7 | 28 | 53 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R28 | yes | yes | TOOLS | 5 | 2 | 28 | 46 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX53 | yes | yes | TOOLS | 20 | 13 | 28 | 45 | AX53 | already in current seed |
| R7 | yes | yes | TOOLS | 5 | 7 | 28 | 42 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM24 | yes | yes | MICROWAVE | 5 | 6 | 28 | 37 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD6 | yes | no |  |  |  | 28 | 37 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC10 | yes | no |  |  |  | 27 | 44 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC12 | yes | no |  |  |  | 27 | 39 | UNKNOWN | approved: U-series -> UNKNOWN |
| AY43 | yes | yes | TOOLS | 20 | 23 | 27 | 38 | AY43 | already in current seed |
| BK53 | yes | yes | VACCUM | 0 | -16 | 27 | 36 | BK53 | already in current seed |
| R30 | yes | yes | TOOLS | 5 | 0 | 27 | 36 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB78 | yes | yes | VCRS | 10 | 1 | 27 | 35 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DM27 | yes | yes | GUITAR AMP | 5 | 3 | 27 | 34 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UC13 | yes | no |  |  |  | 26 | 35 | UNKNOWN | approved: U-series -> UNKNOWN |
| AC18 | yes | yes | OTHER | 20 | 3 | 26 | 34 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UD3 | yes | no |  |  |  | 26 | 33 | UNKNOWN | approved: U-series -> UNKNOWN |
| AX43 | yes | yes | TOOLS | 20 | 18 | 25 | 48 | AX43 | already in current seed |
| R'Z | yes | yes | RINGS | 100 | 0 | 25 | 45 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY31 | yes | yes | TOOLS | 20 | 26 | 25 | 39 | AY31 | already in current seed |
| K3 | yes | yes | 26" T.V. | 4 | 0 | 24 | 49 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K2 | yes | yes | 20" T.V. | 5 | 0 | 24 | 47 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N12 | yes | yes | TOOLS | 4 | 4 | 24 | 44 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX12 | yes | yes | TOOLS | 20 | 18 | 24 | 37 | AX12 | already in current seed |
| AB88 | yes | yes | VCRS | 10 | -1 | 24 | 31 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UK23 | yes | no |  |  |  | 24 | 25 | UNKNOWN | approved: U-series -> UNKNOWN |
| PW | yes | yes | 14 DAYS | 100 | 180 | 23 | 4550 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| ZZZ | yes | no |  |  |  | 23 | 478 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R9 | yes | yes | TOOLS | 5 | 8 | 23 | 43 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DC4 | yes | yes | SM STEREO | 5 | 7 | 23 | 31 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DB11 | yes | yes | FURNITURE | 5 | 3 | 23 | 30 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ5 | yes | no |  |  |  | 23 | 29 | UNKNOWN | approved: U-series -> UNKNOWN |
| BF63 | yes | no |  |  |  | 22 | 37 | BF63 | already in current seed |
| AY61 | yes | yes | MID ITEMS | 5 | 5 | 22 | 32 | AY61 | already in current seed |
| R29 | yes | yes | TOOLS | 5 | 1 | 22 | 32 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UC14 | yes | no |  |  |  | 22 | 32 | UNKNOWN | approved: U-series -> UNKNOWN |
| L50 | yes | yes | 14" T.V. | 5 | 6 | 22 | 28 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UK13 | yes | yes | TYPEWRITER | 4 | 4 | 22 | 28 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC4 | yes | no |  |  |  | 21 | 37 | UNKNOWN | approved: U-series -> UNKNOWN |
| BQ22 | yes | yes | BABY ITEMS | 6 | 0 | 21 | 34 | BQ22 | already in current seed |
| AX42 | yes | yes | TOOLS | 20 | 13 | 21 | 31 | AX42 | already in current seed |
| L46 | yes | yes | 14" T.V. | 5 | 1 | 21 | 23 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UH4 | yes | no |  |  |  | 21 | 22 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC15 | yes | no |  |  |  | 20 | 38 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC16 | yes | no |  |  |  | 20 | 36 | UNKNOWN | approved: U-series -> UNKNOWN |
| R31 | yes | yes | TOOLS | 5 | 1 | 20 | 30 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UC6 | yes | no |  |  |  | 20 | 30 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK20 | yes | no |  |  |  | 20 | 23 | UNKNOWN | approved: U-series -> UNKNOWN |
| K1 | yes | yes | 20" T.V. | 4 | 0 | 19 | 51 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY41 | yes | yes | TOOLS | 20 | 16 | 19 | 35 | AY41 | already in current seed |
| UC3 | yes | no |  |  |  | 19 | 31 | UNKNOWN | approved: U-series -> UNKNOWN |
| L'F | yes | no |  |  |  | 19 | 27 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BUY | yes | yes | PURCHASE ITE | 999 | -1 | 18 | 854 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| WATC | yes | no |  |  |  | 18 | 84 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UC7 | yes | no |  |  |  | 18 | 29 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC8 | yes | no |  |  |  | 18 | 29 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC20 | yes | no |  |  |  | 18 | 28 | UNKNOWN | approved: U-series -> UNKNOWN |
| UC9 | yes | no |  |  |  | 18 | 27 | UNKNOWN | approved: U-series -> UNKNOWN |
| UD7 | yes | no |  |  |  | 18 | 25 | UNKNOWN | approved: U-series -> UNKNOWN |
| DM7 | yes | yes | SM. MICROWAV | 5 | 1 | 18 | 22 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UK21 | yes | no |  |  |  | 18 | 21 | UNKNOWN | approved: U-series -> UNKNOWN |
| UK9 | yes | no |  |  |  | 18 | 21 | UNKNOWN | approved: U-series -> UNKNOWN |
| K4 | yes | yes | 20" T.V. | 5 | 0 | 17 | 38 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UC11 | yes | no |  |  |  | 17 | 30 | UNKNOWN | approved: U-series -> UNKNOWN |
| DW4 | yes | yes | WEIGHT SET | 6 | 5 | 17 | 29 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ20 | yes | no |  |  |  | 17 | 17 | UNKNOWN | approved: U-series -> UNKNOWN |
| UJ6 | yes | no |  |  |  | 16 | 25 | UNKNOWN | approved: U-series -> UNKNOWN |
| DWF | yes | yes | WEIGHT SET | 30 | 6 | 15 | 28 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ4 | yes | no |  |  |  | 15 | 23 | UNKNOWN | approved: U-series -> UNKNOWN |
| UD9 | yes | no |  |  |  | 15 | 22 | UNKNOWN | approved: U-series -> UNKNOWN |
| AX63 | yes | yes | TOOLS | 20 | 16 | 15 | 21 | AX63 | already in current seed |
| AX34 | yes | yes | TOOLS | 20 | 16 | 15 | 20 | AX34 | already in current seed |
| BN21 | yes | yes | MISC | 10 | 0 | 15 | 19 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ18 | yes | no |  |  |  | 15 | 17 | UNKNOWN | approved: U-series -> UNKNOWN |
| L49 | yes | yes | 14" T.V. | 5 | 8 | 15 | 16 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UC17 | yes | no |  |  |  | 14 | 25 | UNKNOWN | approved: U-series -> UNKNOWN |
| BN11 | yes | no |  |  |  | 14 | 22 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX32 | yes | yes | TOOLS | 20 | 19 | 14 | 21 | AX32 | already in current seed |
| UD2 | yes | no |  |  |  | 14 | 20 | UNKNOWN | approved: U-series -> UNKNOWN |
| L45 | yes | yes | 14" T.V. | 5 | 3 | 14 | 15 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| GUIT | yes | yes | LARGE ITEMS | 0 | 0 | 13 | 38 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX81 | yes | yes | TOOLS | 20 | 17 | 13 | 31 | AX81 | already in current seed |
| S'R | yes | no |  |  |  | 13 | 27 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BQ42 | yes | no |  |  |  | 13 | 23 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UC18 | yes | no |  |  |  | 13 | 21 | UNKNOWN | approved: U-series -> UNKNOWN |
| AX91 | yes | yes | TOOLS | 20 | 14 | 13 | 19 | AX91 | already in current seed |
| AY23 | yes | yes | TOOLS | 20 | 14 | 13 | 17 | AY23 | already in current seed |
| L51 | yes | yes | 20" T.V. | 4 | 2 | 13 | 15 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BM23 | yes | yes | MISC | 0 | -21 | 12 | 33 | BM23 | already in current seed |
| K8 | yes | yes | 20" T.V. | 1 | 0 | 12 | 22 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY32 | yes | yes | TOOLS | 20 | 19 | 12 | 17 | AY32 | already in current seed |
| UK24 | yes | no |  |  |  | 12 | 17 | UNKNOWN | approved: U-series -> UNKNOWN |
| DB8 | yes | yes | FURNITUURE | 5 | 0 | 12 | 14 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX22 | yes | yes | TOOLS | 20 | 23 | 11 | 23 | AX22 | already in current seed |
| AY51 | yes | yes | MISC | 1 | 0 | 11 | 22 | AY51 | already in current seed |
| R36 | yes | yes | TOOLS | 8 | 0 | 11 | 18 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BN22 | yes | yes | MISC | 10 | 0 | 11 | 16 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ8 | yes | no |  |  |  | 11 | 13 | UNKNOWN | approved: U-series -> UNKNOWN |
| RR'X | yes | yes | OTHER | 20 | 1 | 11 | 12 | RR-X | format: RR apostrophe -> RR hyphen |
| AY42 | yes | yes | TOOLS | 20 | 22 | 10 | 17 | AY42 | already in current seed |
| DB3 | yes | yes | FURNITURE | 5 | 6 | 10 | 17 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DW6 | yes | yes | WEIGHT SET | 6 | -1 | 10 | 17 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| G'R | yes | no |  |  |  | 10 | 17 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UC19 | yes | no |  |  |  | 10 | 17 | UNKNOWN | approved: U-series -> UNKNOWN |
| BN23 | yes | yes | MISC | 10 | 0 | 10 | 16 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BL33 | yes | yes | MISC. | 9 | 1 | 10 | 14 | BL33 | already in current seed |
| BN12 | yes | yes | MISC | 10 | 0 | 10 | 14 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| W'R | yes | no |  |  |  | 10 | 14 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R34 | yes | yes | TOOLS | 5 | 1 | 10 | 11 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L47 | yes | yes | 20" T.V. | 4 | 2 | 10 | 10 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P'R | yes | no |  |  |  | 9 | 23 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| B'R | yes | no |  |  |  | 9 | 22 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX44 | yes | yes | TOOLS | 20 | 16 | 9 | 16 | AX44 | already in current seed |
| AX52 | yes | yes | TOOLS | 20 | 17 | 9 | 16 | AX52 | already in current seed |
| DB7 | yes | yes | FURNITURE | 5 | 2 | 9 | 16 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R32 | yes | yes | TOOLS | 5 | 0 | 9 | 14 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ7 | yes | no |  |  |  | 9 | 12 | UNKNOWN | approved: U-series -> UNKNOWN |
| DA4 | yes | yes | FURNITURE | 4 | 1 | 8 | 16 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY33 | yes | yes | TOOLS | 20 | 18 | 8 | 14 | AY33 | already in current seed |
| AVEC | yes | yes | BARGAN | 0 | 20 | 8 | 8 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX33 | yes | yes | TOOLS | 20 | 17 | 7 | 19 | AX33 | already in current seed |
| AX23 | yes | yes | TOOLS | 20 | 23 | 7 | 16 | AX23 | already in current seed |
| BASE | yes | no |  |  |  | 7 | 12 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| SAFE | yes | yes | SAFE | 100 | -3 | 7 | 10 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX62 | yes | yes | TOOLS | 20 | 16 | 7 | 9 | AX62 | already in current seed |
| UH5 | yes | no |  |  |  | 7 | 9 | UNKNOWN | approved: U-series -> UNKNOWN |
| UJ9 | yes | no |  |  |  | 7 | 9 | UNKNOWN | approved: U-series -> UNKNOWN |
| BE15 | yes | no |  |  |  | 7 | 8 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX14 | yes | yes | TOOLS | 20 | 19 | 6 | 10 | AX14 | already in current seed |
| DW5 | yes | yes | WEIGHT SET | 5 | 1 | 6 | 10 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DA6 | yes | yes | FURNITURE | 4 | -1 | 6 | 7 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DB6 | yes | yes | FURNITURE | 5 | 0 | 6 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY13 | yes | yes | TOOLS | 20 | 18 | 5 | 11 | AY13 | already in current seed |
| BE14 | yes | no |  |  |  | 5 | 8 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R33 | yes | yes | TOOLS | 5 | 0 | 5 | 8 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UJ19 | yes | no |  |  |  | 5 | 6 | UNKNOWN | approved: U-series -> UNKNOWN |
| TRAD | yes | no |  |  |  | 5 | 5 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M'R | yes | no |  |  |  | 4 | 20 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| C'R | yes | no |  |  |  | 4 | 13 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T'R | yes | no |  |  |  | 4 | 11 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| LTOP | yes | no |  |  |  | 4 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DW | yes | no |  |  |  | 4 | 5 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U'R | yes | no |  |  |  | 4 | 5 | UNKNOWN | approved: U-series -> UNKNOWN |
| UH6 | yes | no |  |  |  | 4 | 5 | UNKNOWN | approved: U-series -> UNKNOWN |
| TTOP | yes | no |  |  |  | 3 | 12 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K9 | yes | yes | 20" T.V. | 1 | 0 | 3 | 9 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX24 | yes | yes | TOOLS | 20 | 20 | 3 | 7 | AX24 | already in current seed |
| BN13 | yes | yes | MISC | 10 | 0 | 3 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| F'R | yes | no |  |  |  | 3 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K10 | yes | yes | 20" T.V. | 1 | 0 | 3 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX54 | yes | yes | TOOLS | 20 | 18 | 3 | 5 | AX54 | already in current seed |
| K'R | yes | no |  |  |  | 3 | 5 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX66 | yes | yes | TOOLS | 20 | 19 | 3 | 4 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BK13 | yes | no |  |  |  | 3 | 4 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BL13 | yes | yes | GUITAR | 0 | -1 | 3 | 4 | BL13 | already in current seed |
| BS1 | yes | yes | MISC. | 0 | 0 | 3 | 4 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DV | yes | no |  |  |  | 3 | 3 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R40 | yes | yes | TOOLS | 5 | 0 | 3 | 3 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| D'R | yes | no |  |  |  | 2 | 10 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K12 | yes | no |  |  |  | 2 | 9 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX45 | yes | yes | TOOLS | 20 | 20 | 2 | 6 | AX45 | already in current seed |
| J'R | yes | no |  |  |  | 2 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R35 | yes | yes | TOOLS | 5 | 0 | 2 | 5 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DB4 | yes | yes | FURNITURE | 5 | 3 | 2 | 4 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K6 | yes | yes | 20" T.V. | 3 | 0 | 2 | 4 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UL | yes | no |  |  |  | 2 | 4 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| WAT | yes | no |  |  |  | 2 | 3 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Y | yes | no |  |  |  | 2 | 3 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC19 | yes | yes | OTHER | 20 | 1 | 2 | 2 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX82 | yes | yes | TOOLS | 20 | 21 | 2 | 2 | AX82 | already in current seed |
| CAME | yes | no |  |  |  | 2 | 2 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DA7 | yes | yes | FURNITURE | 4 | 0 | 2 | 2 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Q'R | yes | no |  |  |  | 2 | 2 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K5 | yes | yes | 26" T.V. | 4 | 1 | 1 | 13 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L'R | yes | no |  |  |  | 1 | 9 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX64 | yes | yes | TOOLS | 20 | 16 | 1 | 7 | AX64 | already in current seed |
| K11 | yes | no |  |  |  | 1 | 7 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K7 | yes | yes | 20" T.V. | 3 | 0 | 1 | 7 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| A'R | yes | no |  |  |  | 1 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K13 | yes | no |  |  |  | 1 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| GUI | yes | no |  |  |  | 1 | 5 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| H'R | yes | no |  |  |  | 1 | 5 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| J6 | yes | no |  |  |  | 1 | 5 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY34 | yes | yes | TOOLS | 20 | 19 | 1 | 4 | AY34 | already in current seed |
| AX73 | yes | yes | TOOLS | 20 | 19 | 1 | 3 | AX73 | already in current seed |
| I'R | yes | no |  |  |  | 1 | 3 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| KHAN | yes | no |  |  |  | 1 | 2 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L48 | yes | yes | 26" T.V. | 3 | 0 | 1 | 2 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R38 | yes | yes | TOOLS | 5 | 0 | 1 | 2 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB79 | yes | yes | VCRS | 10 | 1 | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB99 | yes | yes | VCRS | 10 | 0 | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC39 | yes | yes | OTHER | 20 | -1 | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AUTO | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY62 | yes | yes | MID ITEMS | 5 | 5 | 1 | 1 | AY62 | already in current seed |
| BH | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| C1C | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DW ] | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DW5C | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| F7 | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| FROT | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| G'RY | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K1K | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| KBOO | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L. | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| LF A | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| LF K | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| LF T | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| LRON | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M'S | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| O5 | yes | yes | DRILL | 7 | 0 | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P10 | yes | yes | TOOLS | 5 | 1 | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P7 | yes | yes | TOOLS | 5 | 0 | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'LK | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| STR | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| STRE | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T  E | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T  L | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T'F | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TRAE | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UE24 | yes | no |  |  |  | 1 | 1 | UNKNOWN | approved: U-series -> UNKNOWN |
| UMN | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| UV3 | yes | no |  |  |  | 1 | 1 | UNKNOWN | approved: U-series -> UNKNOWN |
| UV4 | yes | no |  |  |  | 1 | 1 | UNKNOWN | approved: U-series -> UNKNOWN |
| V'R | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| WATH | yes | no |  |  |  | 1 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| J5 | yes | no |  |  |  | 0 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N'R | yes | no |  |  |  | 0 | 6 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX72 | yes | yes | TOOLS | 20 | 18 | 0 | 4 | AX72 | already in current seed |
| E'R | yes | no |  |  |  | 0 | 3 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AIRT | yes | no |  |  |  | 0 | 2 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| 10 | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| 15 | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| ATOP | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| B1` | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| B433 | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BF2 | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| D | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| DS18 | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| GUIJ | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| GUNB | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| H  B | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| J1` | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K  T | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K 8 | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K HA | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| K3T | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L'SK | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| M | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| N' | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| NBC | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| O'R | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| O'RB | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| O1 | yes | yes | DRILL | 7 | 0 | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Q1 | yes | yes | TOOLS | 8 | 1 | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'RL | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'RP | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R37 | yes | yes | TOOLS | 5 | 0 | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| SAFT | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T  B | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T  H | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| T'TP | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| TELP | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| U'T | yes | no |  |  |  | 0 | 1 | UNKNOWN | approved: U-series -> UNKNOWN |
| Y'R | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| YH | yes | no |  |  |  | 0 | 1 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AB89 | no | yes | VCRS | 10 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AC29 | no | yes | OTHER | 20 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX15 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX15 | already in current seed |
| AX16 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX16 | already in current seed |
| AX25 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX25 | already in current seed |
| AX26 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX26 | already in current seed |
| AX35 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX35 | already in current seed |
| AX36 | no | yes | TOOLS | 20 | 20 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX46 | no | yes | TOOLS | 20 | 20 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX55 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX55 | already in current seed |
| AX56 | no | yes | TOOLS | 20 | 20 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX65 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX65 | already in current seed |
| AX74 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX74 | already in current seed |
| AX75 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX75 | already in current seed |
| AX76 | no | yes | TOOLS | 20 | 20 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX83 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX83 | already in current seed |
| AX84 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX84 | already in current seed |
| AX85 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX85 | already in current seed |
| AX86 | no | yes | TOOLS | 20 | 20 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AX92 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX92 | already in current seed |
| AX93 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX93 | already in current seed |
| AX94 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX94 | already in current seed |
| AX95 | no | yes | TOOLS | 20 | 20 | 0 | 0 | AX95 | already in current seed |
| AX96 | no | yes | TOOLS | 20 | 20 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| AY63 | no | yes | MID ITEMS | 4 | 5 | 0 | 0 | AY63 | already in current seed |
| BC91 | no | yes | BIG STUFF | 20 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC92 | no | yes | BIG STUFF | 20 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC93 | no | yes | BIG STUFF | 20 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BC94 | no | yes | BIG STUFF | 20 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BL23 | no | yes | GUITAR | 0 | 0 | 0 | 0 | BL23 | already in current seed |
| BR1 | no | yes | MISC. | 0 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BR2 | no | yes | MISC | 0 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BR3 | no | yes | MISC | 0 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BS2 | no | yes | MISC. | 0 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BS3 | no | yes | MISC. | 0 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BT1 | no | yes | MISC. | 0 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BT2 | no | yes | MISC. | 0 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| BT3 | no | yes | MISC. | 0 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L44 | no | yes | 20" T.V. | 4 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| L52 | no | yes | 26" T.V. | 4 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| O2 | no | yes | DRILL | 7 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| O3 | no | yes | DRILL | 7 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| O4 | no | yes | DRILL | 7 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| O6 | no | yes | DRILL | 7 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| O7 | no | yes | DRILL | 7 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| OFFI | no | yes | 26" T.V. | 4 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P1 | no | yes | SAW | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P11 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P12 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P13 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P14 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P15 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P16 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P17 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P18 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P19 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P2 | no | yes | SAW | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P20 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P21 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P22 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P3 | no | yes | SAW | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P4 | no | yes | SAW | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P5 | no | yes | SAW | 5 | 1 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P6 | no | yes | SAW | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P8 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| P9 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Q2 | no | yes | TOOLS | 8 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Q3 | no | yes | TOOLS | 8 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Q4 | no | yes | TOOLS | 8 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Q5 | no | yes | TOOLS | 8 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Q6 | no | yes | TOOLS | 8 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Q7 | no | yes | TOOLS | 8 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| Q8 | no | yes | TOOLS | 8 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R'X | no | yes | RINGS | 100 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
| R39 | no | yes | TOOLS | 5 | 0 | 0 | 0 | UNKNOWN | default: all other unmapped legacy locations -> UNKNOWN |
