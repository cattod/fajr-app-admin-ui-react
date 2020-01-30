
import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { Setup } from '../setup';
import { fa } from './fa';
import { en } from './en';
// import { ar } from './ar';

// interface ILocalization_tr {
//     [key: string]: string | ILocalization_tr;
// }

interface ILocalization extends LocalizedStringsMethods {
    [key: string]: any; // todo
    catod: string;
    catod_logo: string;
    catod_watermark: string;
    login: string;
    register: string;
    sign_in: string;
    Sign_out: string;
    app_title: string;
    app_title_: string;
    app_logo: string;
    brand_name: string;
    dashboard: string;
    movie: string;
    go_back: string;
    save: string;
    movie_rating: string;
    movie_rating_obj: {
        save: string;
        delete: string;
        view: string;
        manage: string;
    };
    movie_obj: {
        director: string;
        description: string;
        genre: string;
        producer: string;
        pub_year: string;
        writer: string;
        title: string;
        rated_by_user_: string;
        not_rated_by_user_: string;
    };
    rating_wrapper_obj: {
        [key: string]: string;
        detailed_scoring: string;
        story: string;
        form: string;
        norm: string;
        content: string;
    };
    rating_obj: {
        [key: string]: string;

        overall_rate: string;

        novel: string;
        character: string;
        reason: string;

        directing: string;
        acting: string;
        editing: string;
        visualization: string;
        sound: string;
        music: string;

        violence_range: string;
        insulting_range: string;
        sexual_content: string;
        unsuitable_wearing: string;
        addiction_promotion: string;
        horror_content: string;
        suicide_encouragement: string;
        breaking_law_encouragement: string;
        gambling_promotion: string;
        alcoholic_promotion: string;

        family_subject: string;
        individual_social_behavior: string;
        feminism_exposure: string;
        justice_seeking: string;
        theism: string;
        bright_future_exposure: string;
        hope: string;
        iranian_life_style: string;
        true_vision_of_enemy: string;
        true_historiography: string;

        write_comment: string;
        comment_about_movie: string;
        further_details: string;
    };
    rating_value_obj: {
        [key: string]: string;

        perfect: string;
        good: string;
        average: string;
        bad: string;
        poor: string;

        very_much: string;
        much: string;
        normal: string;
        low: string;
        not_at_all: string;

        promoter: string;
        agree: string;
        neutral: string;
        disagree: string;
        destructive: string;
    };
    tags: string;
    back_to_login: string;
    account_logobox_header_text: string;










    forgot_password: string;
    msg: {
        ui: {
            [key: string]: any; // todo
            msg1: string;
            msg2: string;
            msg3: string;
            msg4: string;
            no_network_connection: string;
            new_vesion_available_update: string;
            item_will_be_removed_continue: string;
            file_could_not_be_uploaded: string;
            file_could_not_be_uploaded_max_size_n: string;
            profile_img_not_uploaded_max_size_n: string;
            one_img_upload_allowed_remove_existing_one: string;
            login_again: string;
            sync_error: string;
            change_password_successful: string;
            registered_successful: string;
            movie_filled_any: string;
        },
        back: {
            [key: string]: any; // todo
            user_already_exists: string;
            no_valid_activation_code: string;
            wrong_activation_code: string;
            already_has_valid_key: string;
            message_not_sent: string;
            cell_no_required: string;
            message_sent: string;
            username_exists: string;
            signup_token_not_exists: string;
            invalid_signup_token: string;
            token_invalid: string;
            token_expired: string;
            delete_failed: string;
            get_failed: string;
            auth_decoding_failed: string;
            commit_failed: string;
            no_auth: string;
            invalid_username: string;
            invalid_enum: string;
            not_found: string;
            invalid_persons: string;
            addition_error: string;
            username_cellno_required: string;
            invalid_user: string;
            invalid_code: string;
            filter_required: string;
            upload_failed: string;
            invalid_entity: string;
            access_denied: string;
            already_liked: string;
            comment_not_found: string;
            already_reported: string;
            report_not_found: string;
            parent_not_found: string;
            follow_denied: string;
            already_follows: string;
            missing_requiered_field: string;
            already_rated: string;
            already_exists: string;
            credit_debit_error: string;
            no_price_found: string;
            discount_is_float: string;
            insufficiant_balance: string;
            user_has_no_account: string;
            order_invoiced: string;
            commit_error: string;
            person_has_books: string;
            book_not_in_lib: string;
            online_book_count_limitation: string;
            recheck_information: string;
            analyzing_error: string;
            server_connection_error: string;
            sending_data_error: string;
            payment_canceled: string;
            buyer_cell_no_error: string;
            minimum_payment_error: string;
            maximum_payment_error: string;
            payment_serial_error: string;

            invalid_shopping_key: string;
            payment_already_considered: string;
            payment_inquiry_invalid: string;
            payment_bank_response_invalid: string;
            app_config_required: string;
            in_process: string;
            maximum_active_device: string;
            invalid_password: string;
            content_format_invalid: string;
            book_not_generated: string;
            used_somewhere: string;
            book_has_no_content: string;
            invalid_device: string;
            RID_opration_failed: string;
            schema_not_valid: string;

        }
    };
    validation: {
        minLength: string;
        mobileFormat: string;
        smsCodeFormat: string;
        confirmPassword: string;
        emailFormat: string;
        phoneFormat: string;
    },
    username: string;
    password: string;
    name: string;
    lastname: string;
    phone: string;
    address: string;
    mobile: string;
    email: string;
    confirm_password: string;
    old_password: string;
    new_password: string;
    confirm_new_password: string;
    invalid_value: string;
    required_field: string;
    Show_password: string;
    login_agree_msg: {
        a: string;
        b: string;
        c: string;
    };
    new_to_Bookstore: string;
    need_free_bookstore_account: string;
    register_your_mobile_number: string;
    submit: string;
    already_have_bookstore_account: string;
    verification_code_sended_via_sms_submit_here: string;
    verification_code: string;
    create_an_account: string;
    send_again: string;
    send_again_activationCode: string;
    in: string;
    second: string;
    search: string;
    home: string;
    library: string;
    store: string;
    more: string;
    recomended_for_you: string;
    new_release_in_bookstore: string;
    more_by_writer: string;
    helen_hardet: string;
    it_will_be_launched_soon: string;
    read_now: string;
    view_in_store: string;
    add_to_collection: string;
    mark_as_read: string;
    mark_as_unRead: string;
    share_progress: string;
    recommend_this_book: string;
    remove_from_device: string;
    remove_from_home: string;
    loading_with_dots: string;
    retry: string;
    title: string;
    return: string;
    insert_username_or_mobile: string;
    reset_password: string;
    add_to_list: string;
    log_out: string;
    sync: string;
    syncing: string;
    syncing_with_dots: string;
    last_synced_on: string;
    read_listen_with_audible: string;
    book_update: string;
    reading_insights: string;
    settings: string;
    info: string;
    help_feedback: string;
    about_bookstore_edition: string;
    Length: string;
    pages: string;
    from_the_editor: string;
    about_this_item: string;
    description: string;
    product_description: string;
    review: string;
    reviews: string;
    review_s: string;
    about_the_author: string;
    features_details: string;
    product_details: string;
    publication_date: string;
    publisher: string;
    language: string;
    bookstore_sales_rank: string;
    follow: string;
    unfollow: string;
    customer_review: string;
    customer_vote_s: string;
    read_reviews_that_mention: string;
    see_more: string;
    see_less: string;
    top_reviews: string;
    verified_purchase: string;
    format: string;
    bookstore_edition: string;
    people_found_this_helpful: string;
    people_found_this_helpful_1: string;
    people_report_this: string;
    people_report_this_1: string;
    helpful: string;
    report: string;
    see_all_n_reviews: string;
    write_a_review: string;
    n_out_of_m_stars: string;
    bookstore_books: string;
    best_seller: string;
    more_to_explore: string;
    all: string;
    downloaded: string;
    more_reviews: string;
    thank_you_for_your_feedback: string;
    inspired_by_your_wishlist: string;
    uncollected: string;
    of: string;
    from: string;
    to: string;
    customer_reviews: string;
    by_writerName: string;
    agent: string;
    previous: string;
    next: string;
    no_item_found: string;
    category: {
        [key: string]: any; // todo
        category: string;
        new: string;
        best_seller: string;
        recommended: string;
        wishlist: string;

        romance: string;
        classic: string;
        comedy: string;
        drama: string;
        historical: string;
        religious: string;
        science: string;
        social: string;
    };
    load_more: string;
    book_isben: string;
    your_comment: string;
    remove: string;
    your_report_submited: string;
    vote: string;
    vote_s: string;
    votes: string;
    remove_from_list: string;
    recent_reviews: string;
    minute: string;
    hour: string;
    remove_comment: string;
    close: string;
    app_info: string;
    version: string;
    version_mode: string;
    trial_mode: string;
    trial: string;
    dont_want_now: string;
    update: string;
    shopping_cart: string;
    remove_from_wish_list: string;
    add_to_wish_list: string;
    remove_from_cart_list: string;
    add_to_cart_list: string;
    your_shopping_cart_is_empty: string;
    book_type: string;
    buy: string;
    price: string;
    total_price: string;
    recalculate: string;
    view_detail: string;
    cancel: string;
    ok: string;
    create: string;
    new_collection: string;
    collection_name: string;
    create_new_collection: string;
    remove_collection: string;
    delete_collection_: string;
    rename_collection: string;
    rename: string;
    download_collection: string;
    download_collection_: string;
    download: string;
    downloading: string;
    add: string;
    selected: string;
    select_all: string;
    deselect_all: string;
    profile: string;
    profile_image: string;
    exist_in_library: string;
    preview: string;
    drag_and_drop: string;
    choose_image: string;
    n_min_left_in_chapter: string;
    n_min_left_in_book: string;
    book_from_your_library: string;
    your_recent_item_appear_manage_remove: string;
    go_to_library: string;
    shop_in_store: string;
    sure_you_want_log_out: string;
    readed_: string;
    close_book: string;
    goto: string;
    go: string;
    enter_location: string;
    you_are_reading_loaction_n: string;
    purchase_history: string;
    purchase_date: string;
    page_not_found: string;
    detail: string;
    count: string;
    unit_price: string;
    type: string;
    text_size: string;
    theme: string;
    font: string;

    font_obj: {
        iransans: string;
        nunito: string;
        zar: string;
    };
    account_balance: string;
    increase_credit: string;
    payment: string;
    existing_credit: string;
    increase_amount_rial: string;
    min_increase_amount_rial_is: string;
    payment_status_obj: {
        successful: string;
        'payment-canceled': string;
        unknown: string;
        'payment-amount-invalid': string;
    };
    payment_result: string;

    change_password: string;
    storage: string;
    clear_general_content: string;
    clear_content_security_system: string;
    state: string;
    reset_reader: string;
    confirm: string;
    javscript_file: string;
    webassembly_file: string;
    clear: string;
    unknown: string;
    operating_system: string;
    browser: string;
    device: string;
    active_device_list: string;
    submit_this_device: string;
    this_device: string;
    zoom: string;
    reload_app: string;
    compatible_browsers: string;
    app_compatible_browsers_: string;
    show_book_sample: string;
    play_book_sample: string;
    download_book_sample: string;
}

export const Localization: ILocalization = new LocalizedStrings({
    fa: fa,
    en: en,
    // ar: ar
});

Localization.setLanguage(Setup.internationalization.flag);
