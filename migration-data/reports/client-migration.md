# Client Migration

Generated: 2026-07-14T04:16:00.279Z

Mode: commit

Target database:

```txt
localhost:5432/pawnsystemdb_migration as moneyexpress
```

## Summary

```txt
Legacy AR200CLIENT rows: 56024
Existing target clients before migration: 0
Prepared client rows: 56025
Prepared client_id rows: 126535
Unknown Legacy Client fallback client number: 81904
Blocked client rows: 0
Duplicate source client numbers reassigned: 13
Clients with 0 importable IDs: 104
Clients with 1 importable ID: 961
Clients with 2+ importable IDs: 54959
Rows with missing target city combos: 0
Inserted clients: 56025
Inserted client IDs: 126535
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
  17645  missing/short phone
   3938  unusual weight: 0
   3679  unusual height: 0
   3585  gender defaulted to Other
    961  only one importable ID
    920  overdue_count negative value -1 defaulted to 0
    279  ID 4 has type but no value
    265  overdue_count negative value -2 defaulted to 0
    137  ID 5 has type but no value
    107  overdue_count negative value -3 defaulted to 0
    104  no importable IDs
     64  overdue_count negative value -4 defaulted to 0
     52  ID 3 has type but no value
     51  overdue_count negative value -5 defaulted to 0
     25  overdue_count negative value -6 defaulted to 0
     19  overdue_count negative value -7 defaulted to 0
     17  overdue_count negative value -8 defaulted to 0
     13  ID 2 has type but no value
     13  overdue_count negative value -9 defaulted to 0
     12  missing/invalid date of birth defaulted to 1900-01-01
      9  overdue_count negative value -10 defaulted to 0
      6  overdue_count negative value -13 defaulted to 0
      4  ID 1 has type but no value
      4  overdue_count negative value -11 defaulted to 0
      4  overdue_count negative value -14 defaulted to 0
      3  overdue_count negative value -12 defaulted to 0
      3  overdue_count negative value -15 defaulted to 0
      3  overdue_count negative value -17 defaulted to 0
      3  overdue_count negative value -19 defaulted to 0
      2  missing first name defaulted to null
      2  overdue_count negative value -16 defaulted to 0
      2  overdue_count negative value -21 defaulted to 0
      2  overdue_count negative value -23 defaulted to 0
      2  overdue_count negative value -25 defaulted to 0
      1  duplicate source client number reassigned from 62812 to 81891
      1  duplicate source client number reassigned from 69700 to 81892
      1  duplicate source client number reassigned from 69722 to 81893
      1  duplicate source client number reassigned from 70473 to 81894
      1  duplicate source client number reassigned from 70496 to 81895
      1  duplicate source client number reassigned from 70588 to 81896
      1  duplicate source client number reassigned from 70601 to 81897
      1  duplicate source client number reassigned from 70846 to 81899
      1  duplicate source client number reassigned from 70890 to 81898
      1  duplicate source client number reassigned from 71301 to 81900
      1  duplicate source client number reassigned from 74392 to 81901
      1  duplicate source client number reassigned from 74954 to 81902
      1  duplicate source client number reassigned from 75692 to 81903
      1  expire_count negative value -1 defaulted to 0
      1  missing last name defaulted to null
      1  Unknown Legacy Client fallback client inserted
      1  overdue_count negative value -18 defaulted to 0
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
- 29: overdue_count negative value -4 defaulted to 0

## Duplicate Client Number Reassignments

- 62812 -> 81891
- 69700 -> 81892
- 69722 -> 81893
- 70473 -> 81894
- 70496 -> 81895
- 70588 -> 81896
- 70601 -> 81897
- 70890 -> 81898
- 70846 -> 81899
- 71301 -> 81900
- 74392 -> 81901
- 74954 -> 81902
- 75692 -> 81903

## Mapped ID Type Usage

```txt
  38530  Health Card
  38209  Driver's License
  14329  Indian Status Card
  14121  Social Insurance Number
   7933  Birth Certificate
   6356  Provincial ID
   5793  Other
    630  Firearms License
    522  Canadian Passport
    112  Citizenship Card
```

## Reference Usage

Hair color target usage:

```txt
  32070  BROWN
  16448  BLACK
   4661  OTHER
   1480  GRAY
    942  BLONDE
    275  RED
    141  BALD
      3  WHITE
      2  BLUE
      2  GREEN
```

Eye color target usage:

```txt
  27610  OTHER
  19613  BROWN
   4369  BLUE
   1876  HAZEL
   1735  GREEN
    515  BLACK
    306  GRAY
```

Gender target usage:

```txt
  33482  Male
  18957  Female
   3585  Other
```

Province usage after migration mapping:

```txt
  55523  Saskatchewan
    275  Alberta
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
  56018  Canada
      6  Other
```

## Client Photo Export

Generated: 2026-07-14T04:17:19.954Z

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
Legacy client rows: 56024
Photos exported: 37686
Clients without photo: 18338
JPEG files: 37685
Non-JPEG files: 1
Total exported bytes: 891866948
Updated DB image_path: yes
```

## Duplicate Client Number Reassignments Used

- 62812 -> 81891
- 69700 -> 81892
- 69722 -> 81893
- 70473 -> 81894
- 70496 -> 81895
- 70588 -> 81896
- 70601 -> 81897
- 70890 -> 81898
- 70846 -> 81899
- 71301 -> 81900
- 74392 -> 81901
- 74954 -> 81902
- 75692 -> 81903

## Samples

- 60869: migration-data/exports/client-photos/60869_JONATHAN.jpg
- 60871: migration-data/exports/client-photos/60871_RYAN_E.jpg
- 60872: migration-data/exports/client-photos/60872_CARLANE_E.jpg
- 60873: migration-data/exports/client-photos/60873_BRIAN_VINCENT.jpg
- 60874: migration-data/exports/client-photos/60874_CANDACE.jpg
- 60875: migration-data/exports/client-photos/60875_ALAN.jpg
- 60868: migration-data/exports/client-photos/60868_JANICE.jpg
- 60870: migration-data/exports/client-photos/60870_GLEN_MURDOCK.jpg
- 61718: migration-data/exports/client-photos/61718_ABEL.jpg
- 61719: migration-data/exports/client-photos/61719_ALYSHIA.jpg
