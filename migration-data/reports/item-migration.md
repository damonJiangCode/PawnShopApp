# Item Migration

Generated: 2026-09-27T04:14:04.180Z

Sources: `WC400INVEN` and `SA110ITEM` in `superpawnconv.mdb`

Target database: `pawnsystemdb_migration`

Mode: commit

## Summary

| Metric | Count |
| --- | ---: |
| WC400INVEN rows | 493,356 |
| SA110ITEM rows | 1,072,701 |
| Items prepared | 494,034 |
| Ticket-item links prepared | 1,074,786 |
| Target item rows after commit | 494,034 |
| Target ticket_item rows after commit | 1,074,786 |
| Blocker types | 0 |

## Rules

- Use `WC400INVEN` as the primary item source.
- Add `SA110ITEM` rows only when their item number does not exist in `WC400INVEN`.
- Build `ticket_item` links from `SA110ITEM`, skipping tickets that were not migrated.
- Generate new item numbers for legacy rows where item number is blank, zero, or invalid.
- Default quantity to `1` when the legacy value is blank, zero, or invalid.
- Default blank descriptions to `Unknown item`.
- Map legacy subcategories using `category-migration.md`; fall back to parent category and then `OTHER / other`.

## Blockers

_none_

### Blocker Samples

_none_

## Item Source Counts

```txt
  492888  WC400INVEN item
    1146  SA110ITEM item fallback
```

## Mapping Reasons

```txt
  410795  subcategory rule
   45653  parent fallback
   20502  global other fallback
   17084  parent category fallback
```

## Top Target Subcategories

```txt
   41114  OTHER / other
   39772  ELECTRONICS / game system
   36390  JEWELRY / ring
   35325  AUDIO EQUIPMENT / stereo
   34338  ELECTRONICS / game
   29724  ELECTRONICS / controller
   27761  ELECTRONICS / dvd
   22565  ELECTRONICS / phone
   20562  ELECTRONICS / other
   18803  HAND TOOLS / other
   18008  ELECTRONICS / tv
   11099  AUDIO EQUIPMENT / speaker
   10652  JEWELRY / watch
   10571  ELECTRONICS / camera accessory
    8488  HAND TOOLS / hand tool
    7366  ELECTRONICS / laptop
    7271  MUSICAL INSTRUMENTS / guitar
    6891  APPAREL / jacket
    6632  POWER TOOLS / drill
    5478  POWER TOOLS / saw
    5196  SPORTS & OUTDOOR / golf
    4589  ELECTRONICS / dvd player
    4247  UTILITY TOOLS / other
    4234  ELECTRONICS / desktop
    4130  JEWELRY / chain
    3556  ELECTRONICS / headphone
    3373  ELECTRONICS / computer accessory
    3126  APPLIANCE / other
    2908  HAND TOOLS / socket
    2898  MUSICAL INSTRUMENTS / amplifier
    2678  APPLIANCE / vacuum
    2528  SPORTS & OUTDOOR / other
    2439  APPAREL / beadwork
    2214  UTILITY TOOLS / battery charger
    2089  AUDIO EQUIPMENT / car audio
    2004  SPORTS & OUTDOOR / knife
    1902  APPLIANCE / microwave
    1690  POWER TOOLS / nailer
    1515  AUDIO EQUIPMENT / subwoofer
    1492  AUDIO EQUIPMENT / cd player
    1465  POWER TOOLS / impact driver
    1384  SPORTS & OUTDOOR / fishing gear
    1355  SPORTS & OUTDOOR / bike
    1353  DRYWALL TOOLS / other
    1348  HAND TOOLS / tool belt
    1250  SPORTS & OUTDOOR / fitness equipment
    1139  BABY & KIDS / other
    1103  APPAREL / boots
    1050  UTILITY TOOLS / air compressor
    1006  ELECTRONICS / monitor
    1006  POWER TOOLS / grinder
     836  MUSICAL INSTRUMENTS / keyboard
     824  POWER TOOLS / sander
     800  ELECTRONICS / radar detector
     798  APPLIANCE / fan
     733  APPAREL / other
     729  SPORTS & OUTDOOR / hockey equipment
     700  COLLECTIBLES / other
     693  JEWELRY / necklace
     676  UTILITY TOOLS / ladder
     648  JEWELRY / bracelet
     643  UTILITY TOOLS / jack
     601  COLLECTIBLES / coin
     585  DRYWALL TOOLS / router
     582  HAND TOOLS / wrench
     569  MUSICAL INSTRUMENTS / other
     565  AUDIO EQUIPMENT / microphone
     550  JEWELRY / earrings
     550  SPORTS & OUTDOOR / hunting gear
     541  SPORTS & OUTDOOR / camping gear
     518  APPLIANCE / sewing machine
     515  APPLIANCE / heater
     504  JEWELRY / pendant
     437  AUDIO EQUIPMENT / receiver
     427  MUSICAL INSTRUMENTS / drum
     412  POWER TOOLS / stapler
     382  APPLIANCE / air conditioner
     360  DRYWALL TOOLS / level
     349  DRYWALL TOOLS / safety gear
     344  APPAREL / sunglasses
```

## Top Other Mappings To Review

```txt
   20611  Other / --- Other --- -> OTHER / other
   18772  Tools / --- Other --- -> HAND TOOLS / other
   16038  7777 / 7777 -> OTHER / other
   10011  Television/Video / VCR -> ELECTRONICS / other
    9051  Television/Video / Video Tape -> ELECTRONICS / other
    4464  7779 / 7779 -> OTHER / other
    3055  Vehicle Accessories / --- Other --- -> UTILITY TOOLS / other
    1353  Tools-Industrial / Drywall-Tool -> DRYWALL TOOLS / other
    1139  Child / Accessory --- Other -> BABY & KIDS / other
    1073  Appliance Large / Furniture -> APPLIANCE / other
     993  Appliance Small / Clock -> APPLIANCE / other
     814  Appliance Small / --- Other --- -> APPLIANCE / other
     496  Television/Video / Converter -> ELECTRONICS / other
     440  Art / Print -> COLLECTIBLES / other
     402  Sporting Goods / Helmet -> SPORTS & OUTDOOR / other
     364  Sporting Goods / Skates -> SPORTS & OUTDOOR / other
     363  Television/Video / VCR & Remote -> ELECTRONICS / other
     293  Personal Items / --- Other --- -> APPAREL / other
     247  Sporting Goods / Pool Cue -> SPORTS & OUTDOOR / other
     240  Vehicle Accessories / Battery Cables -> UTILITY TOOLS / other
     232  Sporting Goods / Sword -> SPORTS & OUTDOOR / other
     226  Sporting Goods / Skateboard -> SPORTS & OUTDOOR / other
     200  Television/Video / Remote Control -> ELECTRONICS / other
     175  Sporting Goods / Bat -> SPORTS & OUTDOOR / other
     155  Sporting Goods / --- Other --- -> SPORTS & OUTDOOR / other
     143  Television/Video / Satellite Dish -> ELECTRONICS / other
     140  Sporting Goods / Ball Glove -> SPORTS & OUTDOOR / other
     130  Television/Video / Media Video Tape -> ELECTRONICS / other
     128  Musical Instrument / --- Other --- -> MUSICAL INSTRUMENTS / other
     125  Tools-Industrial / Scale-Digital -> UTILITY TOOLS / other
     124  Art / --- Other --- -> COLLECTIBLES / other
     123  Tools-Industrial / --- Other --- -> UTILITY TOOLS / other
     121  Personal Items / Ornaments -> APPAREL / other
     110  Music Accessory / --- Other --- -> MUSICAL INSTRUMENTS / other
     110  Stereo/Audio/Radio / Karaoke Machine -> AUDIO EQUIPMENT / other
     100  Personal Items / Shaver -> APPAREL / other
      98  Sporting Goods / Skis -> SPORTS & OUTDOOR / other
      98  Television/Video / --- Other --- -> ELECTRONICS / other
      93  Vehicle / --- Other --- -> UTILITY TOOLS / other
      91  Riding Equipment / Saddle -> SPORTS & OUTDOOR / other
      86  Sporting Goods / Rollerblades -> SPORTS & OUTDOOR / other
      74  Personal Items / Vest -> APPAREL / other
      73  Tools / Planer -> POWER TOOLS / other
      71  Appliance Small / Iron -> APPLIANCE / other
      71  Furniture / --- Other --- -> APPLIANCE / other
      68  Vehicle / Car -> UTILITY TOOLS / other
      67  Tools-Industrial / Heat Gun -> UTILITY TOOLS / other
      62  Sporting Goods / Basketball -> SPORTS & OUTDOOR / other
      58  Tools-Industrial / Welding Helmet -> UTILITY TOOLS / other
      57  Tools-Industrial / Torch -> UTILITY TOOLS / other
      45  Sporting Goods / Ball -> SPORTS & OUTDOOR / other
      43  Art / Wall Hanging -> COLLECTIBLES / other
      43  Stereo/Audio/Radio / --- Other --- -> AUDIO EQUIPMENT / other
      42  Music Accessory / Music Stand -> MUSICAL INSTRUMENTS / other
      39  Tools / Polisher -> POWER TOOLS / other
      38  Musical Instrument / Clarinet -> MUSICAL INSTRUMENTS / other
      38  Sporting Goods / Pool Cue Case -> SPORTS & OUTDOOR / other
      38  Tools-Industrial / Air - Hammer -> POWER TOOLS / other
      36  Tools-Industrial / Pump-Water -> UTILITY TOOLS / other
      34  Musical Instrument / Trumpet -> MUSICAL INSTRUMENTS / other
      34  Tools-Industrial / Air - Chisel -> POWER TOOLS / other
      34  Tools-Industrial / Chain Hoist -> UTILITY TOOLS / other
      33  Riding Equipment / --- Other --- -> SPORTS & OUTDOOR / other
      33  Television/Video / Accessories -Other- -> ELECTRONICS / other
      32  Personal Items / Costume -> APPAREL / other
      32  Tools-Industrial / Pump-Sump -> UTILITY TOOLS / other
      31  Jewellery / Digital Scale -> JEWELRY / other
      30  Music Accessory / Guitar Cord -> MUSICAL INSTRUMENTS / other
      30  Music Accessory / Guitar Stand -> MUSICAL INSTRUMENTS / other
      29  Musical Instrument / Mandolin -> MUSICAL INSTRUMENTS / other
      28  Antiques / Collectibles / Silverware -> COLLECTIBLES / other
      28  Personal Items / Pants -> APPAREL / other
      28  Tools / Converter -> HAND TOOLS / other
      27  Art / Sculpture -> COLLECTIBLES / other
      27  Tools-Industrial / Air Tank -> UTILITY TOOLS / other
      26  Personal Items / Buckle -> APPAREL / other
      25  Music Accessory / Effects pedal -> MUSICAL INSTRUMENTS / other
      25  Sporting Goods / Ski Boots -> SPORTS & OUTDOOR / other
      25  Tools-Industrial / Joiner -> POWER TOOLS / other
      24  Appliance Large / Grill -> APPLIANCE / other
```

### Other Mapping Samples

- WC400 item 783496: Other / --- Other ---
- WC400 item 804629: Other / --- Other ---
- WC400 item 724353: Sporting Goods / Skates
- WC400 item 718151: Other / --- Other ---
- WC400 item 718170: Television/Video / Accessories -Other-
- WC400 item 726051: Other / --- Other ---
- WC400 item 716226: Tools-Industrial / Drywall-Tool
- WC400 item 716249: Other / --- Other ---
- WC400 item 791196: Sporting Goods / Pool Cue
- WC400 item 791197: Sporting Goods / Pool Cue
- WC400 item 791198: Sporting Goods / Skateboard
- WC400 item 791199: Television/Video / --- Other ---
- WC400 item 791201: Vehicle Accessories / Battery Cables
- WC400 item 791216: Other / --- Other ---
- WC400 item 750683: Tools-Industrial / Drywall-Tool
- WC400 item 750684: Tools-Industrial / Drywall-Tool
- WC400 item 750685: Tools-Industrial / Drywall-Tool
- WC400 item 750688: Art / --- Other ---
- WC400 item 750690: Other / --- Other ---
- WC400 item 750696: Sporting Goods / Rollerblades
- WC400 item 715762: Other / --- Other ---
- WC400 item 715767: Tools-Industrial / Drywall-Tool
- WC400 item 880258: Other / --- Other ---
- WC400 item 728774: Other / --- Other ---
- WC400 item 803743: Other / --- Other ---
- WC400 item 725885: Other / --- Other ---
- WC400 item 725897: Sporting Goods / Helmet
- WC400 item 725898: Sporting Goods / Helmet
- WC400 item 725899: Sporting Goods / Helmet
- WC400 item 802207: Other / --- Other ---

## Warnings

```txt
  230233  quantity defaulted to 1
   36065  ticket_item skipped because ticket is not migrated
     468  duplicate WC400 item number skipped after first row
     207  description defaulted to Unknown item
     191  synthetic item number generated for invalid SA110 item number
       1  synthetic item number generated for invalid WC400 item number
```

## Item Photo Export

Generated: 2026-09-27T04:16:43.842Z

Source: `WC405ITEMPIC.WC405ITEMPICTURE` from `Pictureconv.mdb`.

Output directory:

```txt
/Users/damon/Documents/PawnShopApp/migration-data/exports/production-20260926/images/items
```

Naming rule:

```txt
itemnumber.jpg
```

## Summary

```txt
Legacy item photo rows: 60633
Rows with photo: 60617
Rows without photo: 16
Photos exported for migrated items: 60617
Photo rows without migrated item: 0
JPEG files: 60617
Non-JPEG files: 0
Total exported bytes: 1987378085
Updated DB image_path: yes
```

## Missing Migrated Item Samples

_none_

## Samples

- 504413: images/items/504413.jpg
- 517706: images/items/517706.jpg
- 518057: images/items/518057.jpg
- 521964: images/items/521964.jpg
- 532619: images/items/532619.jpg
- 552212: images/items/552212.jpg
- 552213: images/items/552213.jpg
- 574003: images/items/574003.jpg
- 575919: images/items/575919.jpg
- 578416: images/items/578416.jpg

