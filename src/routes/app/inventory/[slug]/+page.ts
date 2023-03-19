export const load = ({ params }: { params: { slug: string } }) => {
	return {
		productId: params.slug
	};
};
