# Client Migration

Generated: 2026-07-09T21:23:38.283Z

Mode: dry-run

Target database:

```txt
localhost:5432/pawnsystemdb_migration as moneyexpress
```

## Summary

```txt
Legacy AR200CLIENT rows: 54744
Existing target clients before migration: 54745
Prepared client rows: 13
Prepared client_id rows: 26
Blocked client rows: 54731
Duplicate source client numbers reassigned: 13
Clients with 0 importable IDs: 104
Clients with 1 importable ID: 963
Clients with 2+ importable IDs: 53677
Rows with missing target city combos: 0
Inserted clients: 0
Inserted client IDs: 0
```

## Insert Rules

- Preserve legacy client numbers unless the source number is duplicated.
- Reassign duplicate legacy client numbers to new numbers above the legacy max.
- Default missing/invalid DOB to 1900-01-01.
- Default missing first/last names to literal null.
- Map non-Canada locations to `Other / Other / Other`.
- Prefix `AR200APTNO` onto `address` as `APT {aptNo}`.
- Import `AR200CLIENTMEMO` into `notes`.
- Default negative legacy client counters to `0` so target check constraints pass.
- Import valid ID slots from `AR200ID_1` through `AR200ID_5`; skip `PHO`.
- Leave `image_path` blank for now.

## Blockers

```txt
  54731  client number already exists in target
```

Blocked samples:

- 60869 JONATHAN HUGHES: client number already exists in target
- 60871 RYAN E PINKNEY: client number already exists in target
- 60872 CARLANE E SZABO: client number already exists in target
- 60873 BRIAN VINCENT BAIN: client number already exists in target
- 60874 CANDACE FAITHFUL: client number already exists in target
- 60875 ALAN LAMORE: client number already exists in target
- 60868 JANICE ERMINE: client number already exists in target
- 60870 GLEN MURDOCK CLARK: client number already exists in target
- 61718 ABEL DEAR: client number already exists in target
- 61719 ALYSHIA ASSINIBOINE: client number already exists in target
- 61720 TOMMY BADGER: client number already exists in target
- 61721 JOHN LEASK: client number already exists in target
- 61722 LIAM LARSEN: client number already exists in target
- 60882 MICHAEL SHAYNE MCNAB: client number already exists in target
- 60883 JAMES ZOERB: client number already exists in target
- 60879 RAELENE L LAROCQUE: client number already exists in target
- 60881 CHRISTOPHER J AUBICHON: client number already exists in target
- 61075 ERIC PATRICK J COOK: client number already exists in target
- 60877 JESSE N KOZAR: client number already exists in target
- 60878 TANNIA J LANSALL: client number already exists in target

## Warnings

```txt
  16422  missing/short phone
   3939  unusual weight: 0
   3680  unusual height: 0
   3585  gender defaulted to Other
    963  only one importable ID
    893  overdue_count negative value -1 defaulted to 0
    278  ID 4 has type but no value
    257  overdue_count negative value -2 defaulted to 0
    134  ID 5 has type but no value
    109  overdue_count negative value -3 defaulted to 0
    104  no importable IDs
     57  overdue_count negative value -4 defaulted to 0
     54  overdue_count negative value -5 defaulted to 0
     52  ID 3 has type but no value
     30  overdue_count negative value -6 defaulted to 0
     20  overdue_count negative value -8 defaulted to 0
     15  overdue_count negative value -7 defaulted to 0
     13  ID 2 has type but no value
     12  missing/invalid date of birth defaulted to 1900-01-01
     10  overdue_count negative value -9 defaulted to 0
      8  overdue_count negative value -10 defaulted to 0
      7  overdue_count negative value -13 defaulted to 0
      5  overdue_count negative value -17 defaulted to 0
      4  ID 1 has type but no value
      4  overdue_count negative value -14 defaulted to 0
      3  overdue_count negative value -11 defaulted to 0
      3  overdue_count negative value -12 defaulted to 0
      3  overdue_count negative value -15 defaulted to 0
      2  missing first name defaulted to null
      2  overdue_count negative value -16 defaulted to 0
      2  overdue_count negative value -21 defaulted to 0
      2  overdue_count negative value -25 defaulted to 0
      1  duplicate source client number reassigned from 62812 to 80625
      1  duplicate source client number reassigned from 69700 to 80626
      1  duplicate source client number reassigned from 69722 to 80627
      1  duplicate source client number reassigned from 70473 to 80628
      1  duplicate source client number reassigned from 70496 to 80629
      1  duplicate source client number reassigned from 70588 to 80630
      1  duplicate source client number reassigned from 70601 to 80631
      1  duplicate source client number reassigned from 70846 to 80633
      1  duplicate source client number reassigned from 70890 to 80632
      1  duplicate source client number reassigned from 71301 to 80634
      1  duplicate source client number reassigned from 74392 to 80635
      1  duplicate source client number reassigned from 74954 to 80636
      1  duplicate source client number reassigned from 75692 to 80637
      1  expire_count negative value -1 defaulted to 0
      1  missing last name defaulted to null
      1  overdue_count negative value -18 defaulted to 0
      1  overdue_count negative value -19 defaulted to 0
      1  overdue_count negative value -23 defaulted to 0
      1  overdue_count negative value -24 defaulted to 0
      1  redeem_count negative value -1 defaulted to 0
      1  redeem_count negative value -13 defaulted to 0
      1  redeem_count negative value -3 defaulted to 0
      1  redeem_count negative value -4 defaulted to 0
      1  redeem_count negative value -6 defaulted to 0
      1  unusual height: 269.2
      1  unusual weight: 1902.4
      1  unusual weight: 310
      1  unusual weight: 453.1
```

Warning samples:

- 60875: unusual weight: 0
- 60882: missing/short phone
- 60890: missing/short phone
- 60889: ID 4 has type but no value
- 5951: missing/short phone; ID 3 has type but no value; ID 4 has type but no value
- 14385: ID 4 has type but no value
- 61080: missing/short phone
- 2275: ID 4 has type but no value; overdue_count negative value -1 defaulted to 0
- 10397: overdue_count negative value -6 defaulted to 0
- 53112: ID 4 has type but no value
- 55743: overdue_count negative value -2 defaulted to 0
- 59229: missing/short phone
- 53957: overdue_count negative value -1 defaulted to 0
- 10566: overdue_count negative value -2 defaulted to 0
- 23610: ID 4 has type but no value
- 59681: missing/short phone
- 24097: ID 5 has type but no value
- 7717: ID 4 has type but no value; ID 5 has type but no value
- 60740: missing/short phone
- 29: overdue_count negative value -3 defaulted to 0

## Duplicate Client Number Reassignments

- 62812 -> 80625
- 69700 -> 80626
- 69722 -> 80627
- 70473 -> 80628
- 70496 -> 80629
- 70588 -> 80630
- 70601 -> 80631
- 70890 -> 80632
- 70846 -> 80633
- 71301 -> 80634
- 74392 -> 80635
- 74954 -> 80636
- 75692 -> 80637

## Mapped ID Type Usage

```txt
  37704  Health Card
  37475  Driver's License
  14081  Social Insurance Number
  13912  Indian Status Card
   7846  Birth Certificate
   5803  Provincial ID
   5747  Other
    614  Firearms License
    471  Canadian Passport
    112  Citizenship Card
```

## Reference Usage

Hair color target usage:

```txt
  31537  BROWN
  15847  BLACK
   4638  OTHER
   1391  GRAY
    934  BLONDE
    263  RED
    127  BALD
      3  WHITE
      2  BLUE
      2  GREEN
```

Eye color target usage:

```txt
  27675  OTHER
  18566  BROWN
   4229  BLUE
   1796  HAZEL
   1678  GREEN
    501  BLACK
    299  GRAY
```

Gender target usage:

```txt
  32693  Male
  18466  Female
   3585  Other
```

Province usage after migration mapping:

```txt
  54246  Saskatchewan
    274  Alberta
     82  British Columbia
     60  Ontario
     50  Manitoba
      9  Quebec
      6  Other
      5  Nova Scotia
      4  Northwest Territories
      4  Yukon
      3  New Brunswick
      1  Prince Edward Island
```

Country usage after migration mapping:

```txt
  54738  Canada
      6  Other
```

## Client Photo Export

Generated: 2026-07-09T21:24:46.114Z

Source: `AR200CLIENT.AR200CLIENTPIC` from `superpawnconv.mdb`.

Output directory:

```txt
/Users/damon/Documents/PawnShopApp/migration-data/exports/client-photos
```

Naming rule:

```txt
clientnumber_firstname.jpg
```

## Summary

```txt
Legacy client rows: 54744
Photos exported: 36385
Clients without photo: 18359
JPEG files: 36384
Non-JPEG files: 1
Total exported bytes: 811861755
Updated DB image_path: yes
```

## Duplicate Client Number Reassignments Used

- 62812 -> 80611
- 69700 -> 80612
- 69722 -> 80613
- 70473 -> 80614
- 70496 -> 80615
- 70588 -> 80616
- 70601 -> 80617
- 70890 -> 80618
- 70846 -> 80619
- 71301 -> 80620
- 74392 -> 80621
- 74954 -> 80622
- 75692 -> 80623

## Samples

- 60869: migration-data/exports/client-photos/60869_JONATHAN_2.jpg
- 60871: migration-data/exports/client-photos/60871_RYAN_E_2.jpg
- 60872: migration-data/exports/client-photos/60872_CARLANE_E_2.jpg
- 60873: migration-data/exports/client-photos/60873_BRIAN_VINCENT_2.jpg
- 60874: migration-data/exports/client-photos/60874_CANDACE_2.jpg
- 60875: migration-data/exports/client-photos/60875_ALAN_2.jpg
- 60868: migration-data/exports/client-photos/60868_JANICE_2.jpg
- 60870: migration-data/exports/client-photos/60870_GLEN_MURDOCK_2.jpg
- 61718: migration-data/exports/client-photos/61718_ABEL_2.jpg
- 61719: migration-data/exports/client-photos/61719_ALYSHIA_2.jpg

