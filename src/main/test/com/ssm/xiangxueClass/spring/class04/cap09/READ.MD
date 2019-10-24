自动装配bean的几种方式
@Autowired
@Qualifier配合autowired使用

@Resources
    不支持@Primary和@Autowired（required=false）功能


@Inject
    支持@primary 不支持@Autowired（required=false）功能
    但是需要单独引用javax的第三方依赖


Autowired属于spring的, 不能脱离spring,  @Resource和@Inject都是JAVA规范
推荐大家使用@Autowired