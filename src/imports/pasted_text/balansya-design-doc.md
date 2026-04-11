Design a clean, modern, user-friendly, and highly connected web application for a capstone project called Balansya, a web-based skill matching and production line balancing system for small culinary enterprises.
The system must feel practical, editable, realistic, and suitable for MSME culinary establishments. The design must not look like separate unrelated modules. It must clearly show how the system flows from worker attendance and availability, to menu setup, to workstation and task setup, to demand and event conditions, to system analysis, to balancing and reassignment recommendations.
The application must be manager-centered and easy to navigate. It should support daily updating, editing, recalculating, and transparent viewing of how the system arrives at utilization, takt time, bottleneck, and line balancing outputs.
Main design goal
Create a connected operational workflow for the website in this order:
Daily Workforce Availability and Worker Records → Daily Menu Setup → Workstation and Task Setup → Demand and Event Input → Skill Matrix → Takt Time Analysis → Utilization Monitor → Bottleneck Detector → Station Assignment and Rebalancing → Dashboard Summary → Performance Report → Kitchen Layout Editor
The app should visually show that these pages are connected. Use breadcrumbs, progress flow, visual process tracker, or linked navigation to show that one page leads to the next and affects the next computations.
General design requirements
Create a professional admin-style web app with:
•	left sidebar navigation 
•	top header bar 
•	notification bell 
•	question mark icon beside the bell 
•	settings button at the top 
•	clean cards, editable tables, calculation panels, pop-up help tips, tabs, filters, and modal forms 
•	user-friendly layout for non-technical small business managers 
•	practical culinary establishment setting 
•	visually connected pages 
•	simple but polished capstone presentation quality 
Add pop-up instructions or help tooltips in areas that may be difficult to understand, especially for formulas, percentages, and system logic.
Add a Help Center accessed through the question mark icon beside the notification bell. This should contain:
•	website directions and page instructions 
•	explanations of formulas used in all computations 
•	FAQ 
•	how utilization is computed 
•	how takt time is computed 
•	how bottlenecks are identified 
•	how line efficiency is computed 
•	how station assignment recommendations are generated 
Add a Settings page or settings dropdown with:
•	privacy settings 
•	display settings 
•	accessibility settings 
•	account settings 
•	about the system 
•	developer or capstone credits 
Specific concerns that must be addressed in the design
1. Workforce page must be editable and dynamic
The Workforce page must allow:
•	add new worker 
•	edit worker profile 
•	archive or mark resigned worker 
•	change worker status 
•	view active and inactive workers 
When adding a new worker, include fields such as:
•	full name 
•	current role 
•	employment status 
•	active, absent, day off, resigned, unavailable 
•	years or months of experience 
•	competency or skills 
•	preferred station 
•	training record 
•	remarks 
This page must connect directly to the Skill Matrix page. Worker information entered here must automatically feed into skill matrix records and station assignment logic.
2. Daily Menu page must also be editable and connected to calculations
The Daily Menu Input page must allow:
•	add new dish 
•	edit dish 
•	remove or deactivate dish 
•	mark dishes as active for the day 
Each dish must include important information such as:
•	dish name 
•	category 
•	preparation time 
•	cooking time 
•	plating time 
•	serving time 
•	total time 
•	difficulty level 
•	required station 
•	required skill level 
•	batch or made-to-order type 
•	notes 
This page must clearly connect menu items to workload, takt time, bottleneck, and optimization calculations.
3. Demand and Event page must feel more complete
The Demand and Event page must include:
•	expected orders for the day 
•	expected peak hours 
•	service period 
•	event type such as normal day, promo day, holiday, catering day, bulk order day, peak season day 
•	urgency level 
•	dine-in, takeout, or mixed mode 
•	demand level indicator 
•	remarks 
This page must show that these inputs affect takt time, station load, balancing decisions, and bottleneck pressure.
4. Skill Matrix page must be cohesive with the Workforce page
The Skill Matrix page must:
•	prioritize workers who are present during the selected work period 
•	visually separate present and absent workers 
•	highlight absent, unavailable, or day-off workers 
•	include a section or tab for unavailable workers 
•	retain editable skill ratings and ratios 
•	show experience and competency summary from the Workforce page 
•	allow filtering by available workers only 
•	preserve the current editable skill matrix style 
5. Takt Time page must be more elaborate and visual
The Takt Time Analysis page must not feel bland.
Include:
•	formula section 
•	step-by-step calculation panel 
•	input values such as available working time, expected demand, event factor, and active menu load 
•	graphical gauges or charts 
•	takt time output 
•	capacity analysis 
•	demand versus available capacity comparison 
•	explanation of what the result means 
6. Utilization Monitor page must show how utilization is calculated
Add a simple calculation transparency section that shows:
•	total work time 
•	available time 
•	formula 
•	sample breakdown 
Display the formula clearly:
Utilization = Total Work Time / Available Time × 100
Show how the utilization percentage was obtained for each worker or station.
7. Bottleneck Detector page must use culinary workstation names and show its logic
The Bottleneck page must use actual culinary process workstations such as:
•	order taking 
•	ingredient preparation 
•	cooking 
•	plating 
•	serving 
•	cashier or payment 
•	optional beverage station 
•	optional packaging station 
Do not use generic industrial workstation names.
Add a transparent calculation section showing:
•	workload 
•	average task time 
•	utilization 
•	queue pressure 
•	reason why the station is considered a bottleneck 
Make this page easy to understand and transparent for users.
8. Station Assignment page must be editable
The Station Assignment page must allow:
•	manual reassignment of workers 
•	editing assigned worker 
•	editing assigned tasks 
•	editing station assignment 
•	saving manager overrides 
•	displaying system recommendation and manual override option 
Show clearly:
•	worker assigned 
•	assigned tasks 
•	skill match level 
•	station load 
•	remarks 
•	why the recommendation was made 
9. Kitchen Layout Editor must allow flow editing and line efficiency visibility
The Kitchen Layout page is good but needs more editability.
Allow the user to:
•	add a new station in between existing stations 
•	delete station 
•	move station 
•	reset layout 
•	redraw process arrows 
•	manually adjust arrow direction and sequence 
•	create a new layout from scratch 
The arrows must always appear clearly to show the kitchen flow even after editing.
Add a simple calculation panel for:
Line Efficiency
and show how it is computed.
10. Dashboard page must be more appealing and understandable
The Dashboard must be more elaborate, user-friendly, and visually appealing.
Show:
•	number of available workers today 
•	absent workers 
•	active dishes today 
•	expected demand today 
•	average service time 
•	utilization overview 
•	line efficiency 
•	most overloaded station 
•	current bottleneck alert 
•	recommended rebalancing action 
•	station load summary 
•	quick performance indicators 
Use clean cards, charts, warnings, and a strong visual hierarchy so it is understandable even to a public viewer or panel.
11. Performance Report page must also be more user-friendly
The Performance Report page must not feel plain.
Show:
•	daily performance 
•	weekly trends 
•	utilization trends 
•	bottleneck occurrence trends 
•	workload trends 
•	line efficiency trends 
•	service time trends 
•	exportable report layout 
Use readable charts, cards, and summaries that are simple but informative.
12. Add simple pop-up instructions
Add pop-up or tooltip instructions for terms and sections that may not be easy to understand, such as:
•	utilization 
•	takt time 
•	line efficiency 
•	bottleneck 
•	station assignment logic 
•	skill matrix ratings 
These instructions must be simple, short, and manager-friendly.
13. Use the settings button properly
The Settings feature must not be decorative only. It must contain:
•	privacy settings 
•	display and theme settings 
•	accessibility settings 
•	about the system 
•	system credits 
•	account and profile settings 
14. Add a question mark icon beside the notification bell
Add a question mark icon in the top bar beside the notification bell.
When clicked, it should open a help center containing:
•	step-by-step website directions 
•	instructions for each module 
•	all major formulas used in the website 
•	explanation of the logic behind utilization, takt time, bottleneck, line balancing, and station assignment 
•	common questions and answers 
Important system logic requirements
The app must clearly show how the system arrives at its recommendations.
The relationship between pages must be visible:
•	attendance and workforce availability affect skill matrix, utilization, and station assignment 
•	daily menu affects task load, time requirement, and bottleneck pressure 
•	demand and events affect takt time, station load, and balancing recommendations 
•	workstation setup affects bottleneck detection and line balancing 
•	all analysis pages affect station assignment and dashboard outputs 
The website must feel cohesive and transparent, not like random pages with unrelated data.
Suggested page list
Design these screens:
•	Login Page 
•	Dashboard 
•	Workforce Management 
•	Daily Workforce Availability 
•	Daily Menu Input 
•	Workstation and Task Setup 
•	Demand and Event Input 
•	Skill Matrix 
•	Takt Time Analysis 
•	Utilization Monitor 
•	Bottleneck Detector 
•	Station Assignment and Rebalancing 
•	Performance Report 
•	Kitchen Layout Editor 
•	Help Center 
•	Settings 
Design style
Use:
•	modern web app UI 
•	professional but simple look 
•	editable tables 
•	transparent calculation panels 
•	clear navigation 
•	admin-friendly cards and charts 
•	culinary business context 
•	simple but polished capstone presentation quality 
Avoid:
•	static-looking pages 
•	overly industrial generic terminology 
•	weak or plain dashboard design 
•	disconnected modules 
•	cluttered layouts 
Final design goal
The final system must clearly show that Balansya is a practical decision-support website for small culinary enterprises where the manager can:
•	update workers and their attendance 
•	add or remove dishes and their task times 
•	define daily demand and operating conditions 
•	view connected calculations 
•	understand how utilization, takt time, bottlenecks, and line balancing were computed 
•	manually edit and override assignments 
•	navigate easily from input to analysis to recommendation 
The whole website must feel connected, editable, transparent, realistic, and grounded in the daily operations of a small culinary enterprise.

