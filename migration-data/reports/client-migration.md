# Client Migration

Generated: 2026-09-27T04:09:20.029Z

Mode: commit

Target database:

```txt
localhost:5432/pawnsystemdb_migration as moneyexpress
```

## Summary

```txt
Legacy AR200CLIENT rows: 56258
Existing target clients before migration: 0
Prepared client rows: 56259
Prepared client_id rows: 127035
Unknown Legacy Client fallback client number: 82138
Blocked client rows: 0
Duplicate source client numbers reassigned: 13
Clients with 0 importable IDs: 104
Clients with 1 importable ID: 961
Clients with 2+ importable IDs: 55193
Rows with missing target city combos: 0
Inserted clients: 56259
Inserted client IDs: 127035
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

_none_

Blocked samples:

_none_

## Warnings

```txt
  17879  missing/short phone
   3937  unusual weight: 0
   3679  unusual height: 0
   3585  gender defaulted to Other
    961  only one importable ID
    930  overdue_count negative value -1 defaulted to 0
    278  ID 4 has type but no value
    266  overdue_count negative value -2 defaulted to 0
    137  ID 5 has type but no value
    114  overdue_count negative value -3 defaulted to 0
    104  no importable IDs
     64  overdue_count negative value -4 defaulted to 0
     54  overdue_count negative value -5 defaulted to 0
     52  ID 3 has type but no value
     28  overdue_count negative value -6 defaulted to 0
     21  overdue_count negative value -8 defaulted to 0
     14  overdue_count negative value -7 defaulted to 0
     13  ID 2 has type but no value
     12  overdue_count negative value -9 defaulted to 0
      9  overdue_count negative value -10 defaulted to 0
      7  missing/invalid date of birth defaulted to 1900-01-01
      7  overdue_count negative value -13 defaulted to 0
      4  ID 1 has type but no value
      4  overdue_count negative value -14 defaulted to 0
      4  overdue_count negative value -15 defaulted to 0
      4  overdue_count negative value -17 defaulted to 0
      3  overdue_count negative value -11 defaulted to 0
      3  overdue_count negative value -19 defaulted to 0
      2  expire_count negative value -1 defaulted to 0
      2  missing first name defaulted to null
      2  overdue_count negative value -12 defaulted to 0
      2  overdue_count negative value -16 defaulted to 0
      2  overdue_count negative value -21 defaulted to 0
      2  overdue_count negative value -25 defaulted to 0
      1  duplicate source client number reassigned from 62812 to 82125
      1  duplicate source client number reassigned from 69700 to 82126
      1  duplicate source client number reassigned from 69722 to 82127
      1  duplicate source client number reassigned from 70473 to 82128
      1  duplicate source client number reassigned from 70496 to 82129
      1  duplicate source client number reassigned from 70588 to 82130
      1  duplicate source client number reassigned from 70601 to 82131
      1  duplicate source client number reassigned from 70846 to 82133
      1  duplicate source client number reassigned from 70890 to 82132
      1  duplicate source client number reassigned from 71301 to 82134
      1  duplicate source client number reassigned from 74392 to 82135
      1  duplicate source client number reassigned from 74954 to 82136
      1  duplicate source client number reassigned from 75692 to 82137
      1  missing last name defaulted to null
      1  overdue_count negative value -20 defaulted to 0
      1  overdue_count negative value -23 defaulted to 0
      1  redeem_count negative value -1 defaulted to 0
      1  redeem_count negative value -13 defaulted to 0
      1  redeem_count negative value -3 defaulted to 0
      1  redeem_count negative value -4 defaulted to 0
      1  redeem_count negative value -6 defaulted to 0
      1  Unknown Legacy Client fallback client inserted
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

- 62812 -> 82125
- 69700 -> 82126
- 69722 -> 82127
- 70473 -> 82128
- 70496 -> 82129
- 70588 -> 82130
- 70601 -> 82131
- 70890 -> 82132
- 70846 -> 82133
- 71301 -> 82134
- 74392 -> 82135
- 74954 -> 82136
- 75692 -> 82137

## Mapped ID Type Usage

```txt
  38663  Health Card
  38353  Driver's License
  14428  Indian Status Card
  14127  Social Insurance Number
   7945  Birth Certificate
   6449  Provincial ID
   5794  Other
    634  Firearms License
    530  Canadian Passport
    112  Citizenship Card
```

## Reference Usage

Hair color target usage:

```txt
  32177  BROWN
  16548  BLACK
   4665  OTHER
   1494  GRAY
    944  BLONDE
    278  RED
    145  BALD
      3  WHITE
      2  BLUE
      2  GREEN
```

Eye color target usage:

```txt
  27599  OTHER
  19808  BROWN
   4395  BLUE
   1888  HAZEL
   1742  GREEN
    520  BLACK
    306  GRAY
```

Gender target usage:

```txt
  33629  Male
  19044  Female
   3585  Other
```

Province usage after migration mapping:

```txt
  55758  Saskatchewan
    274  Alberta
     82  British Columbia
     62  Ontario
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
  56252  Canada
      6  Other
```

## Client Photo Export

Generated: 2026-09-27T04:10:29.331Z

Source: `AR200CLIENT.AR200CLIENTPIC` from `superpawnconv.mdb`.

Output directory:

```txt
/Users/damon/Documents/PawnShopApp/migration-data/exports/production-20260926/images/clients
```

Naming rule:

```txt
clientnumber_firstname.jpg
```

## Summary

```txt
Legacy client rows: 56258
Photos exported: 37926
Clients without photo: 18332
JPEG files: 37925
Non-JPEG files: 1
Total exported bytes: 907572254
Updated DB image_path: yes
```

## Duplicate Client Number Reassignments Used

- 62812 -> 82125
- 69700 -> 82126
- 69722 -> 82127
- 70473 -> 82128
- 70496 -> 82129
- 70588 -> 82130
- 70601 -> 82131
- 70890 -> 82132
- 70846 -> 82133
- 71301 -> 82134
- 74392 -> 82135
- 74954 -> 82136
- 75692 -> 82137

## Samples

- 60869: images/clients/60869_JONATHAN.jpg
- 60871: images/clients/60871_RYAN_E.jpg
- 60872: images/clients/60872_CARLANE_E.jpg
- 60873: images/clients/60873_BRIAN_VINCENT.jpg
- 60874: images/clients/60874_CANDACE.jpg
- 60875: images/clients/60875_ALAN.jpg
- 60868: images/clients/60868_JANICE.jpg
- 60870: images/clients/60870_GLEN_MURDOCK.jpg
- 61718: images/clients/61718_ABEL.jpg
- 61719: images/clients/61719_ALYSHIA.jpg

## Client Statistics Recalculation

Generated: 2026-09-27T04:16:50.374Z

Mode: commit

Rules:

- `redeem_count`: count tickets with status `pawned_picked_up`.
- `expire_count`: count tickets with status `pawned_expired` only.
- `sell_count`: count tickets with status `sold` or `sold_expired`, plus any ticket whose location is `BIWK`.
- `partial_payment` and other ticket amounts do not affect these statistics.

Summary:

```txt
Clients with changed statistics: 16293
Clients with ticket-derived stats: 51917
Before redeem total: 478829
Before expire total: 146135
Before sold total: 10548
Recomputed redeem total: 486989
Recomputed expire total: 130781
Recomputed sold total: 20419
After redeem total: 486989
After expire total: 130781
After sold total: 20419
```

Ticket status counts used:

```txt
  486989  pawned_picked_up
  130781  pawned_expired
   15332  sold_expired
    2748  pawned
```

Largest changed clients:

| client_number | client_name | redeem | expire | sold | total_delta |
| ---: | --- | ---: | ---: | ---: | ---: |
| 5675 | COURTOREILLE, HARLEY CHARLES | 287 -> 495 | 51 -> 51 | 210 -> 0 | 418 |
| 74473 | MEMISEVIC, JASMIN | 16 -> 17 | 137 -> 23 | 0 -> 115 | 230 |
| 70036 | MOOSEWAYPAYO, MITCHELL | 39 -> 43 | 147 -> 40 | 0 -> 111 | 222 |
| 9541 | CHRISTAL, DOUG | 232 -> 322 | 82 -> 80 | 90 -> 12 | 170 |
| 9494 | KINNIEWESS, BLAINE | 137 -> 212 | 15 -> 15 | 75 -> 0 | 150 |
| 74493 | DANIELS, MIRANDA | 1 -> 1 | 73 -> 3 | 0 -> 70 | 140 |
| 50789 | SEMCHYSHEN, MICHAEL THOMAS | 37 -> 37 | 98 -> 31 | 0 -> 67 | 134 |
| 74281 | GAVIN, DAYTON | 0 -> 0 | 68 -> 2 | 0 -> 66 | 132 |
| 13480 | PRITCHARD, RONNIE F | 557 -> 542 | 384 -> 327 | 1 -> 59 | 130 |
| 67018 | SPRAYSON, JESSE | 43 -> 48 | 79 -> 23 | 0 -> 61 | 122 |
| 78606 | GALLANT, AARON Z | 0 -> 3 | 57 -> 5 | 0 -> 55 | 110 |
| 76276 | LOYER, WILLIAM JOHN | 0 -> 0 | 53 -> 3 | 0 -> 50 | 100 |
| 16228 | GRAY, WILLARD EDWARD | 19 -> 19 | 58 -> 10 | 0 -> 48 | 96 |
| 52956 | PECHAWIS, VICTOR VERN H | 16 -> 16 | 88 -> 45 | 0 -> 43 | 86 |
| 12305 | MCKAY, COREY D | 10 -> 54 | 22 -> 21 | 43 -> 9 | 79 |
| 65158 | SKIBA, CORY | 115 -> 113 | 56 -> 24 | 0 -> 39 | 73 |
| 1743 | COTE, EDNA THOREEN | 6 -> 43 | 11 -> 11 | 37 -> 3 | 71 |
| 1975 | POUNDMAKER, BETTY ANN | 38 -> 74 | 15 -> 15 | 36 -> 2 | 70 |
| 13490 | HENTON, DAVID M | 0 -> 1 | 40 -> 5 | 1 -> 35 | 70 |
| 66103 | VANDALE, LEANNA GLADYS | 52 -> 50 | 47 -> 14 | 0 -> 33 | 68 |