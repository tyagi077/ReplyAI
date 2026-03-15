module news_storage::news {
    use std::signer;
    use std::string::String;
    use std::vector;

    struct News has copy, store, drop {
        title: String,
        description: String,
        file_cids: vector<String>, 
        thumbnail_cid: String,     
    }

    struct NewsCollection has key {
        news_items: vector<News>,
    }

    public entry fun initialize(account: &signer) {
        let collection = NewsCollection {
            news_items: vector::empty<News>(),
        };
        move_to(account, collection);
    }

    public entry fun create_news(
        account: &signer,
        title: String,
        description: String,
        file_cids: vector<String>,
        thumbnail_cid: String
    ) acquires NewsCollection {
        let collection = borrow_global_mut<NewsCollection>(signer::address_of(account));
        let news = News {
            title,
            description,
            file_cids,
            thumbnail_cid,
        };
        vector::push_back(&mut collection.news_items, news);
    }

    public fun get_news(account_addr: address): vector<News> acquires NewsCollection {
        let collection = borrow_global<NewsCollection>(account_addr);
        collection.news_items
    }
}