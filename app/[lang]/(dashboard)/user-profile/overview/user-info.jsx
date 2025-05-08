import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone,Location, CalenderCheck, ClipBoard, Envelope } from "@/components/svg";

const UserInfo = () => {
  const userInfo = [
    {
      icon: User,
      label: "Full Name",
      value: "Jennyfer Frankin",
    },
    {
      icon: Phone,
      label: "Mobile",
      value: "+(1) 987 6543",
    },
    {
      icon: Envelope,
      label: "Email Address",
      value: "example@gmail.com",
    },
    {
      icon: Location,
      label: "Country / Region",
      value: "Egypt / Cairo",
    },
    {
      icon: CalenderCheck,
      label: "Target",
      value: "85%",
    },
    {
      icon: ClipBoard,
      label: "Language",
      value: "English",
    },
  ];
  return (
    <Card className="h-full">
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-medium text-default-800">Information</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <ul className="mt-4 space-y-6">
          {
            userInfo.map((item, index) => (
              <li
                key={`user-info-${index}`}
                className="flex items-center"
              >
                <div className="flex-none  2xl:w-56 flex items-center gap-1.5">
                  <span>{<item.icon className="w-4 h-4 text-primary" />}</span>
                  <span className="text-sm font-medium text-default-800">{item.label}:</span>
                </div>
                <div className="flex-1 text-sm text-default-700">{item.value}</div>
              </li>
            ))
          }
        </ul>
        {/* <div className="mt-6 text-lg font-medium text-default-800 mb-4">Active Teams</div>
        <div className="space-y-3">
          {
            [
              {
                title: "UI/UX Designer",
                img: FigmaImage,
                total: 65
              },
              {
                title: "Frontend Developer",
                img: ReactImage,
                total: 126
              }
            ].map((item, index) => (
              <div
                key={`active-team-${index}`}
                className="flex items-center gap-2"
              >
                <Image src={item.img} alt={item.title} className="w-4 h-4" />
                <div className="text-sm font-medium text-default-800">
                  {item.title}
                  <span className="font-normal">
                    ({item.total} members)
                  </span>
                </div>
              </div>
            ))
          }
        </div> */}
      </CardContent>
    </Card>
  );
};

export default UserInfo;