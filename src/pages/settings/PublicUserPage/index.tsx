import React from "react";
import { useParams } from "react-router-dom";
import { IcDoc } from "../../../helpers/icons";
import { PublishedDocument, User } from "../../../helpers/types";
import { getRelativeDate } from "../../../helpers/util";
import usePageTitle from "../../../hooks/usePageTitle";
import usePublish from "../../../hooks/usePublish";
import { useUser } from "../../../hooks/useUser";

const PublicUserPage = () => {
  const [title, setTitle] = React.useState("");
  usePageTitle(title);

  const { getPublishedDocuments } = usePublish();
  const { getUserInfo } = useUser();
  const [documents, setDocuments] = React.useState<PublishedDocument[]>([]);
  const [userData, setUserData] = React.useState<User | undefined>();
  const { username } = useParams();

  React.useEffect(() => {
    getPublishedDocuments(username as string, setDocuments);
    getUserInfo(username as string).then((data) => {
      setUserData(data);
      setTitle(data?.username ? data?.username : "");
    });
  }, []);

  return (
    <div className="mx-2 flex justify-center">
      <div className="w-full max-w-[1400px] overflow-hidden rounded-lg border-2 border-dark/50 p-2">
        {!userData ? null : (
          <div
            style={{ backgroundImage: `url(${userData.banner})` }}
            className="relative -m-2 flex h-[10rem] justify-between bg-cover shadow-md"
          >
            <div className="absolute bottom-[0%] left-[5%] flex translate-y-[75%] items-center gap-x-3 p-2">
              <div className="overflow-hidden rounded-full border-[6px] border-light shadow-lg">
                <div className="group relative h-[6rem] w-[6rem] transition-all duration-700 hover:scale-110">
                  <img src={userData.img} className="h-full object-cover" />
                </div>
              </div>
              <div className="-space-y-1">
                <div className="text-lg font-semibold text-primary">
                  @{userData.username}
                </div>
                <div className="underline">{userData.email}</div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-32 rounded-lg border-2 border-dark/50">
          <div className="flex items-center border-b-2 border-dark/50 bg-primary pr-1 text-start text-light">
            {/* Head */}
            <div className="grid w-full grid-cols-12 p-2 font-semibold">
              <div className="col-span-9">Schedules</div>
              <div className="col-span-3 text-center">Published At</div>
            </div>
          </div>
          {documents.map((doc, index) => (
            <a
              key={doc.id}
              href={doc.url}
              download
              target="_blank"
              className={`menu-item group grid w-full grid-cols-12 text-center ${
                index % 2 === 0 && "bg-dark/10"
              }`}
            >
              <div className="col-span-9 flex gap-x-1 text-left group-hover:underline">
                <IcDoc className="icon inline-block" />
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {doc.id}
                </div>
              </div>
              <div className="col-span-3 text-center">
                {getRelativeDate(doc.createdAt)}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PublicUserPage;
