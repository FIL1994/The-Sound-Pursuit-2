/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import _ from "lodash";

const SONG_LIST = [
  "Ignorance",
  "Electromagnetic Life",
  "Mind",
  "An Illusive Incident",
  "The Night",
  "Another Country",
  "Love to Run",
  "The Signal",
  "It Takes Time",
  "Escape",
  "Right Through Me",
  "Moment of Change",
  "Hide Here",
  "The Day She Left",
  "Bullet",
  "On the Other Side",
  "Subtle Misinterpretation",
  "Hope for the Broken",
  "Chaos Consumes",
  "Victory is Ours",
  "The Story of Jane",
  "What It Could Be",
  "Through the Years",
  "Lost Forever",
  "In the End",
  "Positive Man",
  "Retake",
  "Destruction",
  "All That's Painful",
  "Resent",
  "My Grudge",
  "Fearful",
  "Walking Down the Road",
  "Cover It Up",
  "Contain",
  "Resistance Again",
  "Black & White",
  "All Tied Up",
  "The Farmer",
  "Go Back to Sleep",
  "New Air",
  "There is Nothing Left",
  "Nervous",
  "A Thousand Soldiers",
  "Man in the Suit",
  "Take What You Get",
  "All Sides",
  "The Past Can't Save You",
  "Starring at the Stage",
  "The Machine Will Never Die",
  "Northern Star",
  "Hide Away",
  "Fire & Oil",
  "Whatever Holds You",
  "(Keep Your) Eye on the Target",
  "When Legends Fall",
  "Here We Stand",
  "Slice",
  "Because of the Fall",
  "For No One",
  "Song A",
  "Sand",
  "I Wonder",
  "Wretched Road",
  "A to Z",
  "High Rise",
  "Mystery",
  "Chemicals",
  "The Things We Do",
  "North Then West",
  "The Exception",
  "Living on the Edge",
  "General",
  "One More Mistake",
  "Taken Over",
  "Looking Straight Up",
  "Deep",
  "All Shuffled Up",
  "A Few Moments",
  "Recover",
  "Into the Night",
  "I Told You",
  "Leave Me",
  "Going Around",
  "All This Time",
  "The Rest of Your Life",
  "Don't Come Back",
  "Poisoned",
  "Caught in a Hurricane",
  "Broken Bones",
  "Remain",
  "Unexpected",
  "Loud",
  "One Chance",
  "Fancy Tie",
  "Stopping On Time",
  "A Thousand Miles",
  "Smart Remark",
  "Never Giving Up",
  "Fight Free",
  "A Spark",
  "Your Politics",
  "Show Me",
  "Lost in the Universe",
  "Surfing Through These Memories",
  "Apology",
  "Okay, Good",
  "Coping",
  "Stay",
  "Pain & Hunger",
  "Stay Still",
  "Wishing You Well",
  "All is Good",
  "Spend",
  "Stabilize",
  "Tell Me Why",
  "Wait",
  "Nobody",
  "The Sky",
  "It Calls Us",
  "News to You",
  "The Code",
  "Balance",
  "The Weather",
  "Step Outside",
  "A Way Around It",
  "The Sun",
  "Wide Open",
  "Metatarsus",
  "Spinning Around",
  "Since the Start",
  "Less Common",
  "Let's Reconsider",
  "Our Ways",
  "Failed Plans",
  "To Go Back",
  "Voice of the Past",
  "New Territory",
  "Every Way",
  "Dark Light",
  "Long Time",
  "Looking Forward",
  "Driveway",
  "One More Moment",
  "Great Times",
  "This Week",
  "Take It Away",
  "From the Top",
  "Ready For It All",
  "Driving in the Night",
  "In the Rain",
  "Old Tree",
  "On a Mountain",
  "Look Around",
  "One Way Street",
  "You're Not Getting This",
  "Another Time",
  "Tell Me Everything",
  "Change Your Mind",
  "The Rise and Fall",
  "On the Edge of Everything",
  "Through the Window",
  "Take It or Leave It",
  "To Go Back There",
  "Over the Fence",
  "On My Mind",
  "Jump",
  "Waiting Game",
  "Last One Left",
  "Before",
  "Energy",
  "Live",
  "Again & Again",
  "In the End",
  "The Latest News",
  "Simplicity",
  "These Days",
  "Say Hello",
  "Fire",
  "The Letter You",
  "More Time",
  "Finite Love",
  "These Books",
  "Where It All Starts",
  "The Good One",
  "Temperature",
  "Tomorrow Will Lead Us",
  "Low Tide",
  "When It All Ends",
  "Liquid",
  "Flora",
  "On the Inside",
  "All For You",
  "Plain and Simple",
  "Keep It On",
  "Shallow",
  "One Trip",
  "If You Told Me",
  "Keep Talking",
  "All the Same",
  "Thunder",
  "In My Life",
  "The Ocean",
  "Tame",
  "Like a River",
  "Stars in the Sky",
  "One Thing At a Time",
  "Know What You Did",
  "Think, Think, Think",
  "Take a Breath",
  "Overflow",
  "When I See You",
  "Distance",
  "A Sailor's Song",
  "Think About It",
  "Increasing",
  "The Rest of the World",
  "Never Be",
  "Either One",
  "Good Enough",
  "What It's All About",
  "Porridge",
  "Wide Open Space",
  "Mirrors",
  "Lose It",
  "The Morning Papers",
  "Tragedy",
  "Some Kind of Love",
  "A Champion's Song",
  "Darkest Colours",
  "Keep It True",
  "Reach Out",
  "The Ballad of Jimmy",
  "All For Nothing",
  "Where I Stand",
  "Where?",
  "Get It Right",
  "Memory",
  "Faraway",
  "It's Okay",
  "Eye of the Storm",
  "Just That Simple",
  "From Now On",
  "Where Do We Go?",
  "Reflection",
  "In Crisis",
  "Only Forever",
  "It Comes Around",
  "Follow",
  "Characters",
  "Until the End",
  "Waitress",
  "Slow",
  "Better Than That",
  "Then It's Real",
  "At Long Last",
  "Pendulum",
  "Getaway",
  "Easy Living",
  "A Change",
  "Go",
  "Cheer Up",
  "Fire",
  "The Way",
  "Flow",
  "Strawberry Jam",
  "On the Inside",
  "Definitely",
  "Reconnaissance",
  "His Survey",
  "Voyage of Life",
  "The Former",
  "Merger",
  "At the Time",
  "Journey",
  "Banner",
  "Bias",
  "The Lead",
  "Legitimization",
  "League",
  "Succeed",
  "Supersede",
  "Precede",
  "Take Precedence",
  "Obvious Statement",
  "So Much Cleaner",
  "A Few Friends",
  "Controversy",
  "It's the Law",
  "Third Opportunity",
  "A Little Chat",
  "Tell Your Story",
  "Modern Narrative",
  "Unlike Anything",
  "Strong Opinion",
  "Multi-Dimensional",
  "Another Format",
  "Reasonable",
  "State of Mind",
  "Over There",
  "Left Behind",
  "Old Pictures",
  "I'll Be There",
  "Step In",
  "Pleasant Time",
  "Sort It Out",
  "Just Like the Others",
  "Waiting Forever",
  "Finding It Out",
  "The Afternoon",
  "Ready to See",
  "Notice",
  "Anticipation",
  "Ancient Rights",
  "A Deep Sigh",
  "Let Everything Out",
  "Reunited",
  "Closer Now",
  "It Never Ends",
  "Tension Against",
  "Something Holds Onto Nothing",
  "Aboard This Train",
  "Or For or Again",
  "The Result is the Same",
  "Make It Clear",
  "In the Moment",
  "Rising Tide",
  "The First One",
  "Unsettling",
  "Won't Go",
  "This Procedure",
  "Another Direction",
  "Some Sense of Control",
  "It's Really True",
  "What Makes It Worse",
  "By the Rules You Set",
  "When You're Not Here",
  "I Knew You Before",
  "Pushed Away",
  "Twice",
  "A New Movement",
  "Dedicated",
  "The Centre of It All",
  "Make the Call",
  "It Won't Fade",
  "Sharp Teeth",
  "All Around the World",
  "Autumn Leaves",
  "Call It In",
  "Falsify",
  "Individual Expectations",
  "Here to Stay",
  "Precursor to a Big Event",
  "In Your Mind",
  "Certain to Succeed",
  "A Sure-Fire Way",
  "Broken Flashlight",
  "You Don't Know",
  "Options",
  "Good Management",
  "Time for a Change",
  "First Instinct",
  "Accomplish",
  "Five Times More",
  "The Writing on the Wall",
  "Efficient",
  "The Other Element",
  "What You Are",
  "Dress Code",
  "Unethical",
  "Two Hours",
  "Less to Do",
  "Doing Something",
  "If You Had to Guess",
  "All Over the World",
  "Access",
  "Better Ways",
  "Across the Board",
  "Speculation",
  "Take That Down",
  "Messing With My Mind",
  "The Next Mark",
  "Welcome Back",
  "Finish It",
  "Rather Interesting",
  "All Time",
  "Three Years Later"
];

export default () => {
  return SONG_LIST[_.random(0, SONG_LIST.length - 1)];
};
