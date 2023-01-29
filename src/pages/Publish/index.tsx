import React from "react";
import { useParams } from "react-router-dom";
import { PublishedDocument } from "../../helpers/types";
import usePublish from "../../hooks/usePublish";

const Publish = () => {
  const { getPublishedDocuments } = usePublish();
  const [documents, setDocuments] = React.useState<PublishedDocument[]>([]);
  const { userId } = useParams();

  React.useEffect(() => {
    getPublishedDocuments(userId as string, setDocuments);
  }, []);

  return (
    <div className="flex justify-between">
      <div className="w-full max-w-[1400px] px-2">
        {documents.map((doc) => (
          <div className="flex justify-between">
            <a href={doc.url} download target="_blank">
              {doc.id}
            </a>
            <div>{doc.createdAt.toDate().toDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Publish;
