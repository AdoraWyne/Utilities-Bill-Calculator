# Demo

You can access [the live demo here](https://utilities-bill-calculator.fly.dev/).

# TODO

- Category: Electricity
- 4 housemates but different periods
- ✅ Validation:
  - ✅ number only for bill input
  - ✅ travel date should be within the bill dates
  - ✅ end date should not be before start date
- ✅ what test to write so I can make sure things still work as usual when i make change?
- for Housemate component, better to use dd dt HTML tag?
- ✅ new function: `calculateTotalExclusiveDays`
- ✅ what happen when startDate, endDate, travelStartDate or travelEndDate is ""? (before user enter the value)
- Reset button for the dates and bill amount.
- Is it hard to put monitoring on this app? i.e. how many people visited, Umami or PostHog [Claude](https://claude.ai/chat/82963227-5aa4-4a25-b926-ea9335f423b1).
- E2E testing
- Screenreader reads out "horizontal line"

# Potential

- Add/delete number of housemates
- Edit housemate name
- Dont need to sign in but the first time you come to the page, you need to add housemates, then it will remember.
- Add/delete number of utility name
- Edit utility name
- Persists housemate travel date? Need to think more details
