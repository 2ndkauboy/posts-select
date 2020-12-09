/**
 * External dependencies
 */
const { isUndefined, pickBy } = lodash;

/**
 * WordPress dependencies
 */
const { 
	registerBlockType,
} = wp.blocks;
const {
	Component,
} = wp.element;
const {
	FormTokenField,
} = wp.components;
const {
	withSelect,
} = wp.data;

class PostEditComponent extends Component {
	constructor() {
		super( ...arguments );
	}

	componentDidMount() {
		this.isStillMounted = true;
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	render() {
		const { attributes, setAttributes, posts } = this.props;

		const {
			selectedPosts,
		} = attributes;

		let postNames = [];
		let postsFieldValue = [];
		if ( posts !== null ) {
			postNames = posts.map( ( post ) => post.title.raw );

			postsFieldValue = selectedPosts.map( ( postId ) => {
				let wantedPost = posts.find( ( post ) => {
					return post.id === postId;
				} );
				if ( wantedPost === undefined || ! wantedPost ) {
					return false;
				}
				return wantedPost.title.raw;
			} );
		}


		return(
			<div>
				<FormTokenField
					label='Posts'
					value={ postsFieldValue }
					suggestions={ postNames }
					maxSuggestions={ 20 }
					onChange={ ( selectedPosts ) => {
						// Build array of selected posts.
						let selectedPostsArray = [];
						selectedPosts.map(
							( postName ) => {
								const matchingPost = posts.find( ( post ) => {
									return post.title.raw === postName;

								} );
								if ( matchingPost !== undefined ) {
									selectedPostsArray.push( matchingPost.id );
								}
							}
						)

						setAttributes( { selectedPosts: selectedPostsArray } );
					} }
				/>
			</div>
		)
	}
}

registerBlockType( 'slug/posts-select', {
	title: 'Posts',
	category: 'layout',
	attributes: {
		selectedPosts: {
			type: 'array',
			default: [],
		}
	},
	edit: withSelect( ( select ) => {
		const { getEntityRecords } = select( 'core' );
		const postsQuery = pickBy( {
			per_page: -1,
		}, ( value ) => ! isUndefined( value ) );
		return {
			posts: getEntityRecords( 'postType', 'post', postsQuery ),
		};
	} )( PostEditComponent ),
	save: () => {
		return null;
	}
} );
