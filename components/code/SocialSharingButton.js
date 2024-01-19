import ShareButton from "../ShareSocial/ShareButton";

const SocialSharingButton = ({ slug }) => {
  const URL = `${process.env.NEXTAUTH_URL}/source-code/${slug}`;

  return (
    <>
      <ShareButton url={URL} />
    </>
  );
};
export default SocialSharingButton;
