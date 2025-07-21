import ProfileProgress from "./overview/profile-progress";
import UserInfo from "./overview/user-info";
import Portfolio from "./overview/portfolio";
import Skills from "./overview/skills";
import Connections from "./overview/connections";
import Teams from "./overview/teams";
import About from "./overview/about";
import RecentActivity from "./overview/recent-activity";
import Projects from "./overview/projects";
const Overview = () => {
  return (
    <div className="pt-6 space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* <ProfileProgress /> */}
        <div className="col-span-5">
          <UserInfo />
        </div>
        {/* <Portfolio /> */}
        {/* <Skills /> */}
        {/* <Connections /> */}
        {/* <Teams /> */}
        <div className="col-span-7">
          <About />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <About course={true} />
        {/* <RecentActivity /> */}
        {/* <Projects /> */}
      </div>
    </div>
  );
};

export default Overview;
