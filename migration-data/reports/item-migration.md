# Item Migration

Generated: 2026-07-14T15:21:59.042Z

Sources: `WC400INVEN` and `SA110ITEM` in `superpawnconv.mdb`

Target database: `pawnsystemdb_migration`

Mode: commit

## Summary

| Metric | Count |
| --- | ---: |
| WC400INVEN rows | 490,846 |
| SA110ITEM rows | 1,067,034 |
| Items prepared | 491,524 |
| Ticket-item links prepared | 1,069,323 |
| Target item rows after commit | 491,524 |
| Target ticket_item rows after commit | 1,069,323 |
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
  490378  WC400INVEN item
    1146  SA110ITEM item fallback
```

## Mapping Reasons

```txt
  408502  subcategory rule
   45452  parent fallback
   20502  global other fallback
   17068  parent category fallback
```

## Top Target Subcategories

```txt
   40946  OTHER / other
   39535  ELECTRONICS / game system
   36339  JEWELRY / ring
   35312  AUDIO EQUIPMENT / stereo
   34263  ELECTRONICS / game
   29444  ELECTRONICS / controller
   27751  ELECTRONICS / dvd
   22200  ELECTRONICS / phone
   20561  ELECTRONICS / other
   18801  HAND TOOLS / other
   17905  ELECTRONICS / tv
   10968  AUDIO EQUIPMENT / speaker
   10631  JEWELRY / watch
   10536  ELECTRONICS / camera accessory
    8392  HAND TOOLS / hand tool
    7258  ELECTRONICS / laptop
    7236  MUSICAL INSTRUMENTS / guitar
    6891  APPAREL / jacket
    6584  POWER TOOLS / drill
    5425  POWER TOOLS / saw
    5138  SPORTS & OUTDOOR / golf
    4584  ELECTRONICS / dvd player
    4240  UTILITY TOOLS / other
    4229  ELECTRONICS / desktop
    4108  JEWELRY / chain
    3498  ELECTRONICS / headphone
    3351  ELECTRONICS / computer accessory
    3120  APPLIANCE / other
    2889  HAND TOOLS / socket
    2887  MUSICAL INSTRUMENTS / amplifier
    2673  APPLIANCE / vacuum
    2515  SPORTS & OUTDOOR / other
    2411  APPAREL / beadwork
    2178  UTILITY TOOLS / battery charger
    2089  AUDIO EQUIPMENT / car audio
    1990  SPORTS & OUTDOOR / knife
    1897  APPLIANCE / microwave
    1673  POWER TOOLS / nailer
    1510  AUDIO EQUIPMENT / subwoofer
    1490  AUDIO EQUIPMENT / cd player
    1428  POWER TOOLS / impact driver
    1378  SPORTS & OUTDOOR / fishing gear
    1350  DRYWALL TOOLS / other
    1339  HAND TOOLS / tool belt
    1313  SPORTS & OUTDOOR / bike
    1245  SPORTS & OUTDOOR / fitness equipment
    1139  BABY & KIDS / other
    1095  APPAREL / boots
    1045  UTILITY TOOLS / air compressor
     990  POWER TOOLS / grinder
     980  ELECTRONICS / monitor
     831  MUSICAL INSTRUMENTS / keyboard
     813  POWER TOOLS / sander
     799  ELECTRONICS / radar detector
     791  APPLIANCE / fan
     732  APPAREL / other
     729  SPORTS & OUTDOOR / hockey equipment
     700  COLLECTIBLES / other
     692  JEWELRY / necklace
     667  UTILITY TOOLS / ladder
     646  JEWELRY / bracelet
     641  UTILITY TOOLS / jack
     593  COLLECTIBLES / coin
     579  DRYWALL TOOLS / router
     577  HAND TOOLS / wrench
     563  MUSICAL INSTRUMENTS / other
     561  AUDIO EQUIPMENT / microphone
     550  SPORTS & OUTDOOR / hunting gear
     542  JEWELRY / earrings
     538  SPORTS & OUTDOOR / camping gear
     514  APPLIANCE / sewing machine
     507  APPLIANCE / heater
     503  JEWELRY / pendant
     437  AUDIO EQUIPMENT / receiver
     425  MUSICAL INSTRUMENTS / drum
     409  POWER TOOLS / stapler
     362  APPLIANCE / air conditioner
     356  DRYWALL TOOLS / level
     349  DRYWALL TOOLS / safety gear
     336  APPAREL / sunglasses
```

## Top Other Mappings To Review

```txt
   20443  Other / --- Other --- -> OTHER / other
   18770  Tools / --- Other --- -> HAND TOOLS / other
   16038  7777 / 7777 -> OTHER / other
   10011  Television/Video / VCR -> ELECTRONICS / other
    9051  Television/Video / Video Tape -> ELECTRONICS / other
    4464  7779 / 7779 -> OTHER / other
    3055  Vehicle Accessories / --- Other --- -> UTILITY TOOLS / other
    1350  Tools-Industrial / Drywall-Tool -> DRYWALL TOOLS / other
    1139  Child / Accessory --- Other -> BABY & KIDS / other
    1073  Appliance Large / Furniture -> APPLIANCE / other
     993  Appliance Small / Clock -> APPLIANCE / other
     812  Appliance Small / --- Other --- -> APPLIANCE / other
     496  Television/Video / Converter -> ELECTRONICS / other
     440  Art / Print -> COLLECTIBLES / other
     399  Sporting Goods / Helmet -> SPORTS & OUTDOOR / other
     363  Sporting Goods / Skates -> SPORTS & OUTDOOR / other
     363  Television/Video / VCR & Remote -> ELECTRONICS / other
     292  Personal Items / --- Other --- -> APPAREL / other
     244  Sporting Goods / Pool Cue -> SPORTS & OUTDOOR / other
     238  Vehicle Accessories / Battery Cables -> UTILITY TOOLS / other
     231  Sporting Goods / Sword -> SPORTS & OUTDOOR / other
     224  Sporting Goods / Skateboard -> SPORTS & OUTDOOR / other
     200  Television/Video / Remote Control -> ELECTRONICS / other
     175  Sporting Goods / Bat -> SPORTS & OUTDOOR / other
     155  Sporting Goods / --- Other --- -> SPORTS & OUTDOOR / other
     143  Television/Video / Satellite Dish -> ELECTRONICS / other
     139  Sporting Goods / Ball Glove -> SPORTS & OUTDOOR / other
     130  Television/Video / Media Video Tape -> ELECTRONICS / other
     125  Musical Instrument / --- Other --- -> MUSICAL INSTRUMENTS / other
     125  Tools-Industrial / Scale-Digital -> UTILITY TOOLS / other
     124  Art / --- Other --- -> COLLECTIBLES / other
     123  Tools-Industrial / --- Other --- -> UTILITY TOOLS / other
     121  Personal Items / Ornaments -> APPAREL / other
     110  Music Accessory / --- Other --- -> MUSICAL INSTRUMENTS / other
     110  Stereo/Audio/Radio / Karaoke Machine -> AUDIO EQUIPMENT / other
     100  Personal Items / Shaver -> APPAREL / other
      98  Sporting Goods / Skis -> SPORTS & OUTDOOR / other
      97  Television/Video / --- Other --- -> ELECTRONICS / other
      93  Vehicle / --- Other --- -> UTILITY TOOLS / other
      90  Riding Equipment / Saddle -> SPORTS & OUTDOOR / other
      86  Sporting Goods / Rollerblades -> SPORTS & OUTDOOR / other
      74  Personal Items / Vest -> APPAREL / other
      73  Tools / Planer -> POWER TOOLS / other
      71  Furniture / --- Other --- -> APPLIANCE / other
      69  Appliance Small / Iron -> APPLIANCE / other
      67  Vehicle / Car -> UTILITY TOOLS / other
      65  Tools-Industrial / Heat Gun -> UTILITY TOOLS / other
      62  Sporting Goods / Basketball -> SPORTS & OUTDOOR / other
      58  Tools-Industrial / Welding Helmet -> UTILITY TOOLS / other
      57  Tools-Industrial / Torch -> UTILITY TOOLS / other
      45  Sporting Goods / Ball -> SPORTS & OUTDOOR / other
      43  Art / Wall Hanging -> COLLECTIBLES / other
      43  Stereo/Audio/Radio / --- Other --- -> AUDIO EQUIPMENT / other
      42  Music Accessory / Music Stand -> MUSICAL INSTRUMENTS / other
      38  Musical Instrument / Clarinet -> MUSICAL INSTRUMENTS / other
      38  Tools / Polisher -> POWER TOOLS / other
      38  Tools-Industrial / Air - Hammer -> POWER TOOLS / other
      37  Sporting Goods / Pool Cue Case -> SPORTS & OUTDOOR / other
      36  Tools-Industrial / Pump-Water -> UTILITY TOOLS / other
      34  Tools-Industrial / Air - Chisel -> POWER TOOLS / other
      34  Tools-Industrial / Chain Hoist -> UTILITY TOOLS / other
      33  Riding Equipment / --- Other --- -> SPORTS & OUTDOOR / other
      33  Television/Video / Accessories -Other- -> ELECTRONICS / other
      32  Musical Instrument / Trumpet -> MUSICAL INSTRUMENTS / other
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
      26  Personal Items / Buckle -> APPAREL / other
      26  Tools-Industrial / Air Tank -> UTILITY TOOLS / other
      25  Music Accessory / Effects pedal -> MUSICAL INSTRUMENTS / other
      25  Sporting Goods / Ski Boots -> SPORTS & OUTDOOR / other
      25  Tools-Industrial / Joiner -> POWER TOOLS / other
      24  Music Accessory / Speaker Cabinet -> MUSICAL INSTRUMENTS / other
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
   36040  ticket_item skipped because ticket is not migrated
     468  duplicate WC400 item number skipped after first row
     206  description defaulted to Unknown item
     191  synthetic item number generated for invalid SA110 item number
       1  synthetic item number generated for invalid WC400 item number
```

## Item Photo Export

Generated: 2026-07-14T15:24:29.222Z

Source: `WC405ITEMPIC.WC405ITEMPICTURE` from `Pictureconv.mdb`.

Output directory:

```txt
/Users/damon/Documents/PawnShopApp/migration-data/exports/item-photos
```

Naming rule:

```txt
itemnumber.jpg
```

## Summary

```txt
Legacy item photo rows: 58113
Rows with photo: 58097
Rows without photo: 16
Photos exported for migrated items: 58097
Photo rows without migrated item: 0
JPEG files: 58097
Non-JPEG files: 0
Total exported bytes: 1887359783
Updated DB image_path: yes
```

## Missing Migrated Item Samples

_none_

## Samples

- 504413: migration-data/exports/item-photos/504413_2.jpg
- 517706: migration-data/exports/item-photos/517706_2.jpg
- 518057: migration-data/exports/item-photos/518057_2.jpg
- 521964: migration-data/exports/item-photos/521964_2.jpg
- 532619: migration-data/exports/item-photos/532619_2.jpg
- 552212: migration-data/exports/item-photos/552212_2.jpg
- 552213: migration-data/exports/item-photos/552213_2.jpg
- 574003: migration-data/exports/item-photos/574003_2.jpg
- 575919: migration-data/exports/item-photos/575919_2.jpg
- 578416: migration-data/exports/item-photos/578416_2.jpg

