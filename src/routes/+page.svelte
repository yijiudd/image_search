<script lang="ts">
	import { API_ENDPOINT } from '$lib';
	interface Item {
		herf: string;
		data: { description: string; title: string; location: string }[];
		links: { href: string; width: number; height: number }[];
	}
	let query = $state('');
	let searchedQuery = $state('');
	let hasSearched = $state(false);
	let curPage = $state(1);
	let totalPage = $state(0);
	let isLoading = $state(false);
	let fetchData = $state<Item[]>([]);

	const onSearchClick = (event: Event) => {
		event.preventDefault();
		console.log('query', query);
		if (query.trim() == '') return;
		if (isLoading) return;
		if (query == searchedQuery) return;
		searchedQuery = query;
		hasSearched = true;
		isLoading = true;
		fetchData = [];
		fetch(API_ENDPOINT + `/search?q=${query}&media_type=image`, {
			method: 'GET'
		})
			.then((data) => data.json())
			.then((data) => {
				fetchData = data.collection.items;
				totalPage = Math.round(data.collection.metadata.total_hits / 100);
				curPage = 1;
			})
			.finally(() => {
				isLoading = false;
			});
	};
	const onnextPageClick = () => {
		fetchData = [];
		isLoading = true;
		fetch(API_ENDPOINT + `/search?q=${query}&media_type=image&page=${curPage + 1}`, {
			method: 'GET'
		})
			.then((data) => data.json())
			.then((data) => {
				fetchData = data.collection.items;
				curPage += 1;
				isLoading = false;
			});
	};
	const onPrevPageClick = () => {
		fetchData = [];
		isLoading = true;
		fetch(API_ENDPOINT + `/search?q=${query}&media_type=image&page=${curPage - 1}`, {
			method: 'GET'
		})
			.then((data) => data.json())
			.then((data) => {
				fetchData = data.collection.items;
				curPage -= 1;
				isLoading = false;
			});
	};
</script>

<div class="main">
	<div class={hasSearched ? 'searchBar moved' : 'searchBar'}>
		<form onsubmit={onSearchClick}>
			<input id="input" type="text" placeholder="Search..." bind:value={query} />
			<button type="submit">{isLoading ? 'Searching' : 'Search'}</button>
		</form>
	</div>
	<div class="disc">
		{#if hasSearched}
			<div>
				<h2>
					{isLoading ? `Loading...` : `Showing ${fetchData.length} results for "${searchedQuery}"`}
				</h2>
			</div>
		{/if}
		{#if hasSearched && !isLoading}
			<div class="order">
				<div class="item">
					{#if curPage > 1}
						<button onclick={onPrevPageClick}>Previous Page</button>
					{/if}
				</div>
				<div class="item"><h3>Displaying page {curPage} of {totalPage}</h3></div>
				<div class="item">
					{#if curPage < totalPage}
						<button onclick={onnextPageClick}>Next Page</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<div class="content">
		{#if fetchData}
			{#each fetchData as item}
				<div>
					<img
						width={item.links[0].width}
						height={item.links[0].height}
						src={item.links[0].href}
						alt=""
					/>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.main {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-family: sans-serif;
	}
	h2,
	h3 {
		font-weight: 300;
	}
	.order {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	.order .item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.searchBar {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.disc {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.disc button {
		padding: 0.5rem;
		background: linear-gradient(45deg, #2762eb, #003cbc);
		border: none;
		border-radius: 0.5rem;
		color: white;
		font-size: 0.6rem;
		font-weight: 400;
		cursor: pointer;
		box-shadow: 0 10px 30px rgba(26, 89, 162, 0.4);
		transition: all 0.3s ease;
	}
	.searchBar #input {
		padding: 1.2rem 1.5rem;
		border: none;
		border-radius: 50px;
		font-size: 1.1rem;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
		outline: none;
		flex: 1;
		min-width: 400px;
	}
	.searchBar form {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}
	.searchBar button {
		padding: 1.2rem 2rem;
		background: linear-gradient(45deg, #2762eb, #003cbc);
		border: none;
		border-radius: 50px;
		color: white;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 10px 30px rgba(26, 89, 162, 0.4);
		transition: all 0.3s ease;
		min-width: 120px;
	}
	.moved {
		min-height: 30vh;
	}

	.content {
		column-count: 4;
	}
	.content img {
		width: 100%;
		height: auto;
	}
	@media (max-width: 1024px) {
		.content {
			column-count: 3;
		}
	}
	@media (max-width: 768px) {
		.content {
			column-count: 2;
		}
	}
	@media (max-width: 480px) {
		.content {
			column-count: 1;
		}
	}
</style>
